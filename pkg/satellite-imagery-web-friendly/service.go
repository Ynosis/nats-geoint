package satelliteimagerywebfriendly

import (
	"context"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/ConnectEverything/sales-poc-accenture/pkg/shared"
	"github.com/Jeffail/gabs/v2"
	"github.com/cenkalti/backoff/v4"
	"github.com/nats-io/nats.go"
	ffmpeg "github.com/u2takey/ffmpeg-go"
	"golang.org/x/sync/errgroup"
)

func Run(ctx context.Context, tmpDir string) error {
	log.Printf("starting satellite-imagery-web-friendly service")
	defer log.Printf("exiting satellite-imagery-web-friendly service")

	nc := shared.NewNATsClient(ctx)

	js, err := nc.JetStream()
	if err != nil {
		return fmt.Errorf("can't create JetStream context: %w", err)
	}

	metadataKVStore, err := js.KeyValue(shared.KEY_VALUE_STORE_BUCKET_SATELLITE_METADATA)
	if err != nil {
		return fmt.Errorf("can't create key value store metadata context: %w", err)
	}

	highrezObjectStore, err := js.ObjectStore(shared.OBJECT_STORE_BUCKET_HIREZ_FROM_SATELLITES)
	if err != nil {
		return fmt.Errorf("can't create object store hirez context: %w", err)
	}

	webObjectStore, err := js.ObjectStore(shared.OBJECT_STORE_BUCKET_WEB_FRIENDLY_IMAGES)
	if err != nil {
		return fmt.Errorf("can't create object store web friendly context: %w", err)
	}

	sub, err := js.PullSubscribe(
		shared.JETSTREAM_SATELLITE_JOBS_CONVERT_HIREZ_TO_WEB, "convert_to_web_friendly_process",
		nats.AckWait(5*time.Minute), // Convert raw to high resolution can take a while
	)
	if err != nil {
		return fmt.Errorf("can't subscribe to subject: %w", err)
	}

	webFriendlyTmpDir := filepath.Join(tmpDir, "web_friendly")
	if err := os.MkdirAll(webFriendlyTmpDir, 0755); err != nil {
		return fmt.Errorf("can't create temp directory: %w", err)
	}

	convertToWebFriendly := func(highrezURL string) error {
		hiRezPath := filepath.Join(webFriendlyTmpDir, highrezURL+".png")
		if err := highrezObjectStore.GetFile(highrezURL, hiRezPath); err != nil {
			return fmt.Errorf("can't get bytes from object store: %w", err)
		}

		const ext = ".jpg"

		eg := errgroup.Group{}

		fullFilename := highrezURL + "_full"
		fullPath := filepath.Join(webFriendlyTmpDir, fullFilename)
		fullPathWithExt := fullPath + ext
		eg.Go(func() error {
			process := ffmpeg.Input(hiRezPath).
				Output(fullPathWithExt, ffmpeg.KwArgs{
					"filter:v": "scale=1024:-1",
				}).
				OverWriteOutput()

			if err := process.Run(); err != nil {
				return fmt.Errorf("can't run ffmpeg: %w", err)
			}

			b, err := os.ReadFile(fullPathWithExt)
			if err != nil {
				return fmt.Errorf("can't read full path: %w", err)
			}
			if _, err := webObjectStore.PutBytes(fullFilename, b); err != nil {
				return fmt.Errorf("can't publish to full path: %w", err)
			}

			return nil
		})

		thumbnailFilename := highrezURL + "_thumbnail"
		thumbnailPath := filepath.Join(webFriendlyTmpDir, thumbnailFilename)
		thumbnailPathWithExt := thumbnailPath + ext
		eg.Go(func() error {
			process := ffmpeg.Input(hiRezPath).
				Output(thumbnailPathWithExt, ffmpeg.KwArgs{
					"filter:v": "scale=256:-1",
				}).
				OverWriteOutput()

			if err := process.Run(); err != nil {
				return fmt.Errorf("can't run ffmpeg: %w", err)
			}

			b, err := os.ReadFile(thumbnailPathWithExt)
			if err != nil {
				return fmt.Errorf("can't read thumbnail path: %w", err)
			}

			if _, err := webObjectStore.PutBytes(thumbnailFilename, b); err != nil {
				return fmt.Errorf("can't publish to thumbnail path: %w", err)
			}

			return nil
		})

		if err := eg.Wait(); err != nil {
			return fmt.Errorf("can't convert to web friendly: %w", err)
		}

		parts := strings.Split(highrezURL, "_")
		videoFeedID := parts[0]
		frameRaw := parts[1]
		frame, err := strconv.Atoi(frameRaw)
		if err != nil {
			return fmt.Errorf("can't convert frame to int: %w", err)
		}

		for {
			entry, err := metadataKVStore.Get(videoFeedID)
			if err != nil {
				return fmt.Errorf("can't get metadata from key value store: %w", err)
			}
			metadata := shared.MustSatelliteMetadataFromJSON(entry.Value())

			if metadata.WebFriendly.LastFrameProcessed >= frame {
				break
			}

			metadata.WebFriendly.LastFrameProcessed = frame
			getWH := func(path string) (int, int, error) {
				inProbeJSONStr, err := ffmpeg.Probe(path)
				if err != nil {
					return 0, 0, fmt.Errorf("can't probe video feed: %w", err)
				}
				probe, err := gabs.ParseJSON([]byte(inProbeJSONStr))
				if err != nil {
					return 0, 0, fmt.Errorf("can't parse probe json: %w", err)
				}
				width := probe.Path("streams.0.width").Data().(float64)
				height := probe.Path("streams.0.height").Data().(float64)
				return int(width), int(height), nil
			}

			if metadata.WebFriendly.Width == 0 {
				metadata.WebFriendly.Width, metadata.WebFriendly.Height, err = getWH(fullPathWithExt)
				if err != nil {
					return fmt.Errorf("can't get width and height: %w", err)
				}
			}

			if metadata.WebFriendly.ThumbnailWidth == 0 {
				metadata.WebFriendly.ThumbnailWidth, metadata.WebFriendly.ThumbnailHeight, err = getWH(thumbnailPathWithExt)
				if err != nil {
					return fmt.Errorf("can't get thumbnail width and height: %w", err)
				}
			}

			metadata.WebFriendly.FrameCount = metadata.HiRez.FrameCount
			if _, err := metadataKVStore.Update(videoFeedID, metadata.MustToJSON(), entry.Revision()); err != nil {
				log.Printf("Can't update metadata: %v, retrying", err)
			} else {
				break
			}
		}

		// log.Printf("Converted %s to web friendly images %dx%d and %dx%d", highrezURL, width, height, thumbnailWidth, thumbnailHeight)

		return nil
	}

	b := backoff.NewExponentialBackOff()
	for {
		select {
		case <-ctx.Done():
			return nil
		default:
			msgs, err := sub.Fetch(1, nats.MaxWait(b.NextBackOff()))
			if err != nil && err != nats.ErrTimeout {
				return fmt.Errorf("can't fetch message: %w", err)
			}
			if len(msgs) == 0 {
				continue
			}
			b.Reset()

			for _, msg := range msgs {
				highrezURL := string(msg.Data)
				// log.Printf("Received message: %s", highrezURL)

				if err := convertToWebFriendly(highrezURL); err != nil {
					log.Printf("can't convert raw bytes to high resolution: %v", err)
					break
				}

				if err := msg.Ack(); err != nil {
					log.Printf("can't ack message: %v", err)
					break
				}
			}

		}
	}
}

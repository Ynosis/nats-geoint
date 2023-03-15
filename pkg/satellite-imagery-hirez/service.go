package satelliteimageryhirez

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/ConnectEverything/sales-poc-accenture/pkg/shared"
	"github.com/cenkalti/backoff/v4"
	"github.com/nats-io/nats.go"
	"golang.org/x/exp/slices"
)

func Run(ctx context.Context, tmpDir string) error {
	log.Printf("starting satellite-imagery-hirez service")
	defer log.Printf("exiting satellite-imagery-hirez service")

	nc := shared.NewNATsClient(ctx)

	js, err := nc.JetStream()
	if err != nil {
		return fmt.Errorf("can't create JetStream context: %w", err)
	}

	rawObjectStore, err := js.ObjectStore(shared.OBJECT_STORE_BUCKET_RAW_DATA_FROM_SATELLITES)
	if err != nil {
		return fmt.Errorf("can't create object store raw from satellites context: %w", err)

	}
	hirezObjectStore, err := js.ObjectStore(shared.OBJECT_STORE_BUCKET_HIREZ_FROM_SATELLITES)
	if err != nil {
		return fmt.Errorf("can't create object store hi rez from satellites context: %w", err)
	}
	metadataKVStore, err := js.KeyValue(shared.KEY_VALUE_STORE_BUCKET_SATELLITE_METADATA)
	if err != nil {
		return fmt.Errorf("can't create kv metadata context: %w", err)
	}

	sub, err := js.PullSubscribe(
		shared.JETSTREAM_SATELLITE_JOBS_CONVERT_RAW_TO_HIREZ, "convert_to_hirez",
		nats.AckWait(5*time.Minute), // Convert raw to hirez can take a while
	)
	if err != nil {
		return fmt.Errorf("can't subscribe to subject: %w", err)
	}

	// ci, err := js.ConsumerInfo("SATELLITE_JOBS", "convert_to_hirez")
	// if err != nil {
	// 	return fmt.Errorf("can't create consumer: %w", err)
	// }
	// if ci.Config.AckWait != 5*time.Minute {
	// 	ci.Config.AckWait = 5 * time.Minute
	// 	if _, err := js.UpdateConsumer(shared.JETSTREAM_SATELLITE_JOBS_CONVERT_RAW_TO_HIREZ, &ci.Config); err != nil {
	// 		return fmt.Errorf("can't update consumer: %w", err)
	// 	}
	// }

	hiRezTmpDir := filepath.Join(tmpDir, "hi_rez")
	if err := os.MkdirAll(hiRezTmpDir, 0755); err != nil {
		return fmt.Errorf("can't create temp directory: %w", err)
	}

	hiRezTmpFeedDir := filepath.Join(tmpDir, "feed")
	if err := os.MkdirAll(hiRezTmpFeedDir, 0755); err != nil {
		return fmt.Errorf("can't create temp directory: %w", err)
	}

	frameRegex := regexp.MustCompile(`frame=\s*(?P<frame>\d*)`)
	resolutionRegex := regexp.MustCompile(`(?P<w>\d+\d+)x(?P<h>\d+\d+)`)

	convertRawToHirez := func(videoFeedID string) error {
		feedFile := fmt.Sprintf("%s/%s", hiRezTmpFeedDir, videoFeedID)
		if err := rawObjectStore.GetFile(videoFeedID, feedFile); err != nil {
			return fmt.Errorf("can't get raw bytes from object store: %w", err)
		}
		defer os.Remove(feedFile)

		hiRezImagesDir := filepath.Join(tmpDir, "images", videoFeedID)
		if err := os.MkdirAll(hiRezImagesDir, 0755); err != nil {
			return fmt.Errorf("can't create temp directory: %w", err)
		}
		defer os.RemoveAll(hiRezImagesDir)

		rawCMD := fmt.Sprintf(
			// `ffmpeg -i %s -pix_fmt rgb24 -compression_algo lzw -v info -filter:v scale=2048:-1 %s/%%05d.tif`,
			`ffmpeg -i %s -pix_fmt rgb24 -compression_algo lzw -v info %s/%%05d.tif`,
			feedFile, hiRezImagesDir,
		)
		log.Printf("Running command: %s", rawCMD)
		rawCMDParts := strings.Split(rawCMD, " ")
		cmd := exec.Command(rawCMDParts[0], rawCMDParts[1:]...)

		combinedBuffer := bytes.Buffer{}
		mw := io.MultiWriter(os.Stdout, &combinedBuffer)
		cmd.Stdout = mw
		cmd.Stderr = mw

		done := false
		for !done {
			line, err := combinedBuffer.ReadString('\n')
			log.Printf("Line: %s", line)
			if err != nil {
				if done {
					break
				}
				if err != io.EOF {
					return fmt.Errorf("can't read line from ffmpeg output: %w", err)
				}
			}
		}

		if err := cmd.Run(); err != nil {
			return fmt.Errorf("can't convert raw bytes to hirez: %w", err)
		}
		done = true

		// log.Printf("Output: %s", output)

		combinedBuffer.Reset()
		output := combinedBuffer.Bytes()
		frameMatches := frameRegex.FindAllStringSubmatch(string(output), -1)
		if len(frameMatches) == 0 {
			return fmt.Errorf("can't find frame count in ffmpeg output")
		}
		lastMatch := frameMatches[len(frameMatches)-1]
		if len(lastMatch) != 2 {
			return fmt.Errorf("can't find frame count in ffmpeg output")
		}
		lastFrame, err := strconv.Atoi(lastMatch[1])
		if err != nil {
			return fmt.Errorf("can't parse frame count in ffmpeg output: %w", err)
		}

		resolutionMatches := resolutionRegex.FindAllStringSubmatch(string(output), -1)
		if len(resolutionMatches) == 0 {
			return fmt.Errorf("can't find resolution in ffmpeg output")
		}

		lastMatch = resolutionMatches[0]
		if len(lastMatch) != 3 {
			return fmt.Errorf("can't find resolution in ffmpeg output")
		}
		width, err := strconv.Atoi(lastMatch[1])
		if err != nil {
			return fmt.Errorf("can't parse width in ffmpeg output: %w", err)
		}
		height, err := strconv.Atoi(lastMatch[2])
		if err != nil {
			return fmt.Errorf("can't parse height in ffmpeg output: %w", err)
		}

		metadataEntry, err := metadataKVStore.Get(videoFeedID)
		if err != nil {
			return fmt.Errorf("can't get metadata from key value store: %w", err)
		}
		m := shared.MustSatelliteMetadataFromJSON(metadataEntry.Value())
		m.HiRez.FrameCount = lastFrame
		m.HiRez.OrginalResolutionHeight = height
		m.HiRez.OrginalResolutionWidth = width
		if _, err := metadataKVStore.Put(videoFeedID, m.MustToJSON()); err != nil {
			return fmt.Errorf("can't put metadata to key value store: %w", err)
		}

		lastUpdatedFrame := 0
		for lastUpdatedFrame != lastFrame {
			dirEntry, err := os.ReadDir(hiRezImagesDir)
			if err != nil {
				return fmt.Errorf("can't read hirez directory: %w", err)
			}

			slices.SortFunc(dirEntry, func(i, j os.DirEntry) bool {
				return i.Name() < j.Name()
			})

			for _, entry := range dirEntry {
				if entry.IsDir() {
					continue
				}

				frame, err := strconv.Atoi(entry.Name()[:len(entry.Name())-len(filepath.Ext(entry.Name()))])
				if err != nil {
					return fmt.Errorf("can't parse frame number from hirez file: %w", err)
				}

				if frame < lastUpdatedFrame {
					continue
				}

				hirezPath := fmt.Sprintf("%s/%s", hiRezImagesDir, entry.Name())
				hirezBytes, err := os.ReadFile(hirezPath)
				if err != nil {
					return fmt.Errorf("can't read hirez file: %w", err)
				}
				hirezObjectStorePath := fmt.Sprintf("%s_%05d", videoFeedID, frame)

				if _, err := hirezObjectStore.PutBytes(hirezObjectStorePath, hirezBytes); err != nil {
					return fmt.Errorf("can't put hirez to object store: %w", err)
				}

				if _, err := js.Publish(shared.JETSTREAM_SATELLITE_JOBS_CONVERT_HIREZ_TO_WEB, []byte(hirezObjectStorePath)); err != nil {
					return fmt.Errorf("can't publish convert hirez to web message: %w", err)
				}

				lastUpdatedFrame = frame

				// TODO: Talk to team about CAS
				metadataEntry, err := metadataKVStore.Get(videoFeedID)
				if err != nil {
					return fmt.Errorf("can't get metadata from key value store: %w", err)
				}
				m := shared.MustSatelliteMetadataFromJSON(metadataEntry.Value())
				m.HiRez.LastFrameProcessed = lastUpdatedFrame
				if _, err := metadataKVStore.Put(videoFeedID, m.MustToJSON()); err != nil {
					return fmt.Errorf("can't put metadata to key value store: %w", err)
				}
			}
		}

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
				videoFeedID := string(msg.Data)
				log.Printf("Received message: %s", videoFeedID)

				if err := convertRawToHirez(videoFeedID); err != nil {
					log.Printf("can't convert raw bytes to hirez: %v", err)
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

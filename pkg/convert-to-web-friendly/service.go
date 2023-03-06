package converttowebfriendly

import (
	"bytes"
	"context"
	"fmt"
	"image/jpeg"
	"log"
	"strconv"
	"strings"
	"time"

	"github.com/ConnectEverything/sales-poc-accenture/pkg/shared"
	"github.com/anthonynsimon/bild/transform"
	"github.com/cenkalti/backoff"
	"github.com/nats-io/nats.go"
	"golang.org/x/image/tiff"
)

func Run(ctx context.Context) error {

	nc := shared.NewNATsClient(ctx)

	js, err := nc.JetStream()
	if err != nil {
		return fmt.Errorf("can't create JetStream context: %w", err)
	}

	b := backoff.NewExponentialBackOff()

	var metadataKVStore nats.KeyValue
	for metadataKVStore == nil || err != nil {
		metadataKVStore, err = js.KeyValue(shared.KEY_VALUE_STORE_BUCKET_SATELLITE_METADATA)
		if err != nil {
			log.Printf("can't create key value store context: %v", err)
			time.Sleep(b.NextBackOff())
		}
	}
	b.Reset()

	var highrezObjectStore, webObjectStore nats.ObjectStore
	for highrezObjectStore == nil || err != nil {
		highrezObjectStore, err = js.ObjectStore(shared.OBJECT_STORE_BUCKET_HIREZ_FROM_SATELLITES)
		if err != nil {
			// log.Printf("can't create object store context: %v", err)
			time.Sleep(b.NextBackOff())
		}
	}
	b.Reset()

	for webObjectStore == nil || err != nil {
		webObjectStore, err = js.CreateObjectStore(&nats.ObjectStoreConfig{
			Bucket:      shared.OBJECT_STORE_BUCKET_WEB_FRIENDLY_IMAGES,
			Description: "Web friendly images converted from Hi Rez images",
		})
		if err != nil {
			return fmt.Errorf("can't create object store context: %w", err)
		}
	}

	sub, err := js.PullSubscribe(
		shared.JETSTREAM_SATELLITE_JOBS_CONVERT_HIREZ_TO_WEB, "convert_to_web_friendly_process",
		nats.AckWait(5*time.Minute), // Convert raw to high resolution can take a while
	)
	if err != nil {
		return fmt.Errorf("can't subscribe to subject: %w", err)
	}

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
				log.Printf("Received message: %s", highrezURL)

				if err := convertToWebFriendly(js, metadataKVStore, highrezObjectStore, webObjectStore, highrezURL); err != nil {
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

func convertToWebFriendly(
	js nats.JetStreamContext, metadataKVStore nats.KeyValue, hirezObjectStore, webObjectStore nats.ObjectStore, highrezURL string) error {
	buf, err := hirezObjectStore.GetBytes(highrezURL)
	if err != nil {
		return fmt.Errorf("can't get bytes from object store: %w", err)
	}
	r := bytes.NewReader(buf)
	img, err := tiff.Decode(r)
	if err != nil {
		return fmt.Errorf("can't decode high resolution: %w", err)
	}

	maxDimension := 2048
	bounds := img.Bounds()
	originalWidth, originalHeight := bounds.Dx(), bounds.Dy()
	width, height := originalWidth, originalHeight
	maxDimensionFloat, wf, hf := float64(maxDimension), float64(width), float64(height)

	if width > maxDimension {
		width = maxDimension
		height = int(hf * (maxDimensionFloat / wf))
	} else if height > maxDimension {
		height = maxDimension
		width = int(wf * (maxDimensionFloat / hf))
	}
	if width != originalWidth || height != originalHeight {
		img = transform.Resize(img, width, height, transform.Lanczos)
	}

	webPngBuf := &bytes.Buffer{}
	if err := jpeg.Encode(webPngBuf, img, nil); err != nil {
		return fmt.Errorf("can't encode png: %w", err)
	}
	if _, err := webObjectStore.PutBytes(highrezURL+"_full", webPngBuf.Bytes()); err != nil {
		return fmt.Errorf("can't publish to subject: %w", err)
	}

	maxDimension, ratio := 512, wf/hf
	maxDimensionFloat = float64(maxDimension)

	var thumbnailWidth, thumbnailHeight int
	if width > height {
		thumbnailWidth = maxDimension
		thumbnailHeight = int(maxDimensionFloat / ratio)
	} else {
		thumbnailWidth = int(maxDimensionFloat / ratio)
		thumbnailHeight = maxDimension
	}

	thumbnail := transform.Resize(img, thumbnailWidth, thumbnailHeight, transform.Lanczos)
	thumbnailBuf := &bytes.Buffer{}
	if err := jpeg.Encode(thumbnailBuf, thumbnail, nil); err != nil {
		return fmt.Errorf("can't encode png: %w", err)
	}
	if _, err := webObjectStore.PutBytes(highrezURL+"_thumbnail", thumbnailBuf.Bytes()); err != nil {
		return fmt.Errorf("can't publish to subject: %w", err)
	}

	parts := strings.Split(highrezURL, "_")
	videoFeedID := parts[0]
	frameRaw := parts[1]
	frame, err := strconv.Atoi(frameRaw)
	if err != nil {
		return fmt.Errorf("can't convert frame to int: %w", err)
	}

	entry, err := metadataKVStore.Get(videoFeedID)
	if err != nil {
		return fmt.Errorf("can't get metadata from key value store: %w", err)
	}
	metadata := shared.MustSatelliteMetadataFromJSON(entry.Value())
	metadata.LastFrameProcessed = frame
	if _, err := metadataKVStore.Put(videoFeedID, metadata.MustToJSON()); err != nil {
		return fmt.Errorf("can't put metadata to key value store: %w", err)
	}

	log.Printf("Converted %s to web friendly images %dx%d and %dx%d", highrezURL, width, height, thumbnailWidth, thumbnailHeight)

	return nil
}

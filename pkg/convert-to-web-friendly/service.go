package converttowebfriendly

import (
	"bytes"
	"context"
	"fmt"
	"image/png"
	"log"
	"time"

	"github.com/ConnectEverything/sales-poc-accenture/pkg/shared"
	"github.com/anthonynsimon/bild/transform"
	"github.com/cenkalti/backoff"
	"github.com/dustin/go-humanize"
	"github.com/nats-io/nats.go"
	"github.com/valyala/bytebufferpool"
	"golang.org/x/image/tiff"
)

func RunConvertToWebFriendlyService(ctx context.Context) error {

	nc := shared.NewNATsClient(ctx)

	js, err := nc.JetStream()
	if err != nil {
		return fmt.Errorf("can't create JetStream context: %w", err)
	}

	b := backoff.NewExponentialBackOff()

	var tiffObjectStore, webObjectStore nats.ObjectStore
	for tiffObjectStore == nil || err != nil {
		tiffObjectStore, err = js.ObjectStore(shared.BUCKET_TIFFS_FROM_SATELLITES)
		if err != nil {
			// log.Printf("can't create object store context: %v", err)
			time.Sleep(b.NextBackOff())
		}
	}
	for webObjectStore == nil || err != nil {
		webObjectStore, err = js.CreateObjectStore(&nats.ObjectStoreConfig{
			Bucket:      shared.BUCKET_WEB_FRIENDLY_IMAGES,
			Description: "Web friendly images converted from TIFFs",
		})
		if err != nil {
			return fmt.Errorf("can't create object store context: %w", err)
		}
	}

	sub, err := js.PullSubscribe(
		shared.SATELLITE_JOBS_CONVERT_TIFFS_TO_WEB, "convert_to_web_friendly_process",
		// nats.AckWait(5*time.Minute), // Convert raw to tiffs can take a while
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
				tiffURL := string(msg.Data)
				log.Printf("Received message: %s", tiffURL)

				if err := convertToWebFriendly(js, tiffObjectStore, webObjectStore, tiffURL); err != nil {
					log.Printf("can't convert raw bytes to tiffs: %v", err)
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

var byteCount int

func convertToWebFriendly(js nats.JetStreamContext, tiffObjectStore, webObjectStore nats.ObjectStore, tiffURL string) error {
	buf, err := tiffObjectStore.GetBytes(tiffURL)
	if err != nil {
		return fmt.Errorf("can't get bytes from object store: %w", err)
	}
	r := bytes.NewReader(buf)
	img, err := tiff.Decode(r)
	if err != nil {
		return fmt.Errorf("can't decode tiff: %w", err)
	}

	maxDimension, thumbnailRatio := 2048, 0.25
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

	webPngBuf := bytebufferpool.Get()
	defer bytebufferpool.Put(webPngBuf)
	if err := png.Encode(webPngBuf, img); err != nil {
		return fmt.Errorf("can't encode png: %w", err)
	}
	if _, err := webObjectStore.PutBytes(shared.BUCKET_WEB_FRIENDLY_IMAGES+tiffURL, webPngBuf.Bytes()); err != nil {
		return fmt.Errorf("can't publish to subject: %w", err)
	}

	var thumbnailWidth, thumbnailHeight int
	if width > height {
		thumbnailWidth = int(wf * thumbnailRatio)
		thumbnailHeight = int(hf * thumbnailRatio)
	} else {
		thumbnailWidth = int(wf * thumbnailRatio)
		thumbnailHeight = int(hf * thumbnailRatio)
	}

	thumbnail := transform.Resize(img, thumbnailWidth, thumbnailHeight, transform.Lanczos)
	thumbnailBuf := bytebufferpool.Get()
	defer bytebufferpool.Put(thumbnailBuf)
	if err := png.Encode(thumbnailBuf, thumbnail); err != nil {
		return fmt.Errorf("can't encode png: %w", err)
	}
	if _, err := webObjectStore.PutBytes(shared.BUCKET_WEB_FRIENDLY_IMAGES+tiffURL+"_thumbnail", thumbnailBuf.Bytes()); err != nil {
		return fmt.Errorf("can't publish to subject: %w", err)
	}

	byteCount += webPngBuf.Len() + thumbnailBuf.Len()

	log.Printf("Converted %s to web friendly images %dx%d and %dx%d %s processd", tiffURL, width, height, thumbnailWidth, thumbnailHeight, humanize.Bytes(uint64(byteCount)))

	return nil
}

package satelliteimagerymetadata

import (
	"context"
	"errors"
	"fmt"
	"log"
	"sync"

	"github.com/ConnectEverything/sales-poc-accenture/pkg/shared"
	"github.com/cespare/xxhash/v2"
	"github.com/nats-io/nats.go"
	"github.com/nats-io/nats.go/micro"
)

// Make sure that there is metadata we can use to pull data from satellites
func Run(ctx context.Context) error {
	log.Printf("starting satellite imagery metadata service")
	defer log.Printf("exiting satellite imagery metadata service")

	type MetadataStats struct {
		TotalMetadataCreated int `json:"videosProcessed"`
	}
	statsMu := sync.RWMutex{}
	stats := &MetadataStats{}
	nc, _, err := shared.NewNATsClient(ctx, &micro.Config{
		Name:        "satellites-metadata",
		Version:     "0.0.1",
		Description: "Service to create metadata for satellite imagery",
		StatsHandler: func(e *micro.Endpoint) interface{} {
			statsMu.RLock()
			defer statsMu.RUnlock()
			return stats
		},
	})
	if err != nil {
		return fmt.Errorf("can't create NATs client: %w", err)
	}

	js, err := nc.JetStream()
	if err != nil {
		return fmt.Errorf("can't create JetStream context: %w", err)
	}
	kvMetadata, err := js.KeyValue(shared.KEY_VALUE_STORE_BUCKET_SATELLITE_METADATA)
	if err != nil {
		return fmt.Errorf("can't create kv metadata: %w", err)
	}

	errCh := make(chan error, 1)

	sub, err := nc.Subscribe("satellites.metadata.pull", func(msg *nats.Msg) {
		// Let's get the list of existing metadata
		existingMetadataKeys, err := kvMetadata.Keys()
		if err != nil {
			if !errors.Is(err, nats.ErrNoKeysFound) {
				errCh <- fmt.Errorf("can't get metadata keys: %w", err)
				return
			}
		}

		if len(existingMetadataKeys) > 0 {
			return
		}

		// No metadata, let's get some
		// from https://developers.google.com/earth-engine/timelapse/videos"
		videoURLs := []string{
			"https://storage.googleapis.com/earthengine-timelapse/2020/curated/mp4/label/1x/lake-mead.mp4",
			"https://storage.googleapis.com/earthengine-timelapse/2020/curated/mp4/label/1x/beijing-capital-international-airport-beijing-china.mp4",
			"https://storage.googleapis.com/earthengine-timelapse/2020/curated/mp4/label/1x/columbia-glacier-alaska.mp4",
			"https://storage.googleapis.com/earthengine-timelapse/2020/curated/mp4/label/1x/al-jowf-saudi-arabia.mp4",
			"https://storage.googleapis.com/earthengine-timelapse/2020/curated/mp4/label/1x/cancun-mexico.mp4",
			"https://storage.googleapis.com/earthengine-timelapse/2020/curated/mp4/label/1x/kennecott-copper-mine-slc-utah.mp4",
		}

		for _, videoURL := range videoURLs {
			id := xxhash.Sum64String(videoURL)
			idStr := fmt.Sprint(id)

			m := shared.SatelliteMetadata{
				ID:               id,
				InitialSourceURL: videoURL,
			}
			if _, err := kvMetadata.Put(idStr, m.MustToJSON()); err != nil {
				errCh <- fmt.Errorf("can't put metadata into kv store: %w", err)
				return
			}

			log.Printf("added metadata for %s", videoURL)
		}

		statsMu.Lock()
		stats.TotalMetadataCreated += len(videoURLs)
		statsMu.Unlock()
	})
	if err != nil {
		return fmt.Errorf("can't subscribe to satellite metadata pull: %w", err)
	}

	defer sub.Drain()

	select {
	case err := <-errCh:
		return fmt.Errorf("error running services: %w", err)
	case <-ctx.Done():
		return ctx.Err()
	}
}

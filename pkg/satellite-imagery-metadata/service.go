package satelliteimagerymetadata

import (
	"context"
	"errors"
	"fmt"

	"github.com/ConnectEverything/sales-poc-accenture/pkg/shared"
	"github.com/cespare/xxhash/v2"
	"github.com/nats-io/nats.go"
)

// Make sure that there is metadata we can use to pull data from satellites
func Run(ctx context.Context) error {
	nc := shared.NewNATsClient(ctx)

	js, err := nc.JetStream()
	if err != nil {
		return fmt.Errorf("can't create JetStream context: %w", err)
	}
	kvMetadata, err := js.CreateKeyValue(&nats.KeyValueConfig{
		Bucket:  shared.KEY_VALUE_STORE_BUCKET_SATELLITE_METADATA,
		Storage: nats.FileStorage,
	})
	if err != nil {
		return fmt.Errorf("can't create kv metadata: %w", err)
	}

	// Let's get the list of existing metadata
	existingMetadataKeys, err := kvMetadata.Keys()
	if err != nil {
		if !errors.Is(err, nats.ErrNoKeysFound) {
			return fmt.Errorf("can't list existing metadata: %w", err)
		}
	}

	if len(existingMetadataKeys) == 0 {
		// No metadata, let's get some
		// from https://developers.google.com/earth-engine/timelapse/videos"
		videoURLs := []string{
			// "https://storage.googleapis.com/earthengine-timelapse/2020/curated/mp4/3d/label/lake-mead.mp4",
			// "https://storage.googleapis.com/earthengine-timelapse/2020/curated/mp4/3d/label/beijing-capital-international-airport-beijing-china.mp4",
			// "https://storage.googleapis.com/earthengine-timelapse/2020/curated/mp4/3d/label/columbia-glacier-alaska.mp4",
			"https://storage.googleapis.com/earthengine-timelapse/2020/curated/mp4/label/1x/vegas.mp4",
		}

		for _, videoURL := range videoURLs {
			id := xxhash.Sum64String(videoURL)
			idStr := fmt.Sprint(id)

			m := shared.SatelliteMetadata{
				ID:               id,
				InitialSourceURL: videoURL,
			}
			if _, err := kvMetadata.Put(idStr, m.MustToJSON()); err != nil {
				return fmt.Errorf("can't put metadata into kv store: %w", err)
			}

		}
	}

	<-ctx.Done()

	err = ctx.Err()
	return err
}

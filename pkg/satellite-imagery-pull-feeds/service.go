package satelliteimagerypullfeeds

import (
	"context"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/ConnectEverything/sales-poc-accenture/pkg/shared"
	"github.com/nats-io/nats.go"
	"github.com/nats-io/nats.go/micro"
)

func Run(ctx context.Context, tmpDir string) error {
	log.Printf("starting satellite-imagery-pull-feeds service")
	defer log.Printf("exiting satellite-imagery-pull-feeds service")

	nc, _, err := shared.NewNATsClient(ctx, &micro.Config{
		Name:        "satellite-imagery-pull-feeds",
		Version:     "0.0.1",
		Description: "Service to pull feeds from satellites",
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

	rawDataStore, err := js.ObjectStore(shared.OBJECT_STORE_BUCKET_RAW_DATA_FROM_SATELLITES)
	if err != nil {
		log.Printf("can't create object store context: %v", err)
	}

	pullDataTmpDir := filepath.Join(tmpDir, "pull_feeds")
	if err := os.MkdirAll(pullDataTmpDir, 0755); err != nil {
		return fmt.Errorf("can't create pull data tmp dir: %w", err)
	}

	processEntry := func(entry nats.KeyValueEntry) error {
		if entry == nil {
			return nil
		}

		m := shared.MustSatelliteMetadataFromJSON(entry.Value())
		if err != nil {
			return fmt.Errorf("can't parse metadata: %w", err)
		}

		if !m.ShouldBeProcessed || m.PullFromFeed.Bytes > 0 {
			return nil
		}

		// Check if we have a file for this id

		santizedFilename := fmt.Sprintf("%d.mp4", m.ID)
		tmpFile := filepath.Join(pullDataTmpDir, santizedFilename)

		if stat, err := os.Stat(tmpFile); err != nil || stat.Size() == 0 {
			// log.Printf("downloading %s with hash %d", m.InitialSourceURL, m.ID)
			res, err := http.DefaultClient.Get(m.InitialSourceURL)
			if err != nil {
				return fmt.Errorf("can't get file %s: %w", m.InitialSourceURL, err)
			}
			if res.StatusCode != http.StatusOK {

				return fmt.Errorf("can't get file %s: %s", m.InitialSourceURL, res.Status)
			}
			defer res.Body.Close()

			f, err := os.Create(tmpFile)
			if err != nil {
				return fmt.Errorf("can't create file %s: %w", tmpFile, err)
			}
			defer f.Close()

			if _, err := io.Copy(f, res.Body); err != nil {
				return fmt.Errorf("can't copy file %s: %w", tmpFile, err)
			}
		} else {
			m.PullFromFeed.WasCached = true
			// log.Printf("file %s already exists, skipping download", tmpFile)
		}

		tmpFileBytes, err := os.ReadFile(tmpFile)
		if err != nil {
			return fmt.Errorf("can't open file %s: %w", tmpFile, err)
		}

		idStr := fmt.Sprint(m.ID)
		if _, err := rawDataStore.PutBytes(idStr, tmpFileBytes); err != nil {
			return fmt.Errorf("can't put file %s into object store: %w", m.InitialSourceURL, err)
		}

		if _, err := js.Publish(shared.JETSTREAM_SATELLITE_JOBS_CONVERT_RAW_TO_HIREZ, []byte(idStr)); err != nil {
			return fmt.Errorf("can't publish job to convert raw to highrez: %w", err)
		}

		m.PullFromFeed.Bytes = len(tmpFileBytes)
		if _, err := kvMetadata.Put(idStr, m.MustToJSON()); err != nil {
			return fmt.Errorf("can't put metadata into kv store: %w", err)
		}

		return nil
	}

	watch, err := kvMetadata.WatchAll()
	if err != nil {
		return fmt.Errorf("can't create watch: %w", err)
	}
	for {
		select {
		case <-ctx.Done():
			return ctx.Err()

		case entry := <-watch.Updates():
			processEntry(entry)
		}
	}
}

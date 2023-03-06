package datafromsatellites

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/ConnectEverything/sales-poc-accenture/pkg/shared"
	"github.com/cespare/xxhash/v2"
	"github.com/nats-io/nats.go"
	"k8s.io/apimachinery/pkg/util/sets"
)

func Run(ctx context.Context) error {

	nc := shared.NewNATsClient(ctx)

	js, err := nc.JetStream()
	if err != nil {
		return fmt.Errorf("can't create JetStream context: %w", err)
	}

	if _, err := js.AddStream(&nats.StreamConfig{
		Name:     "SATELLITE_JOBS",
		Subjects: []string{shared.JETSTREAM_SATELLITE_JOBS + ".>"},
	}); err != nil {
		return fmt.Errorf("can't create stream: %w", err)
	}

	kvMetadata, err := js.CreateKeyValue(&nats.KeyValueConfig{
		Bucket:  shared.KEY_VALUE_STORE_BUCKET_SATELLITE_METADATA,
		Storage: nats.FileStorage,
	})
	if err != nil {
		return fmt.Errorf("can't create kv metadata: %w", err)
	}

	rawDataStore, err := js.ObjectStore(shared.OBJECT_STORE_BUCKET_RAW_DATA_FROM_SATELLITES)
	if err != nil {
		rawDataStore, err = js.CreateObjectStore(&nats.ObjectStoreConfig{
			Bucket:      shared.OBJECT_STORE_BUCKET_RAW_DATA_FROM_SATELLITES,
			Description: "Raw data from satellites, faked with mp4 files for now",
		})
		if err != nil {
			log.Printf("can't create object store context: %v", err)
		}
	}

	rawAssetsPath, exists := os.LookupEnv("ASSETS_PATH")
	if !exists {
		rawAssetsPath = "assets"
	}

	type VideoURLs struct {
		Videos []string `json:"videos"`
	}
	videoURLsPath := filepath.Join(rawAssetsPath, "video_urls.json")
	videoURLsFile, err := os.Open(videoURLsPath)
	if err != nil {
		return fmt.Errorf("can't open video urls file: %w", err)
	}
	defer videoURLsFile.Close()

	videoURLs := VideoURLs{}
	if err := json.NewDecoder(videoURLsFile).Decode(&videoURLs); err != nil {
		return fmt.Errorf("can't decode video urls file: %w", err)
	}

	existingRaw, err := rawDataStore.List()
	if err != nil && err != nats.ErrNoObjectsFound {
		return fmt.Errorf("can't list existing raw assets: %w", err)
	}
	existingRawSet := sets.New[string]()
	for _, x := range existingRaw {
		existingRawSet.Insert(x.Name)
	}

	for _, url := range videoURLs.Videos {
		id := xxhash.Sum64String(url)
		idStr := fmt.Sprint(id)
		if existingRawSet.Has(idStr) {
			continue
		}

		tmpExt := filepath.Ext(url)
		tmpFile := fmt.Sprintf("./data/src/%d%s", id, tmpExt)
		tmpFile, err := filepath.Abs(tmpFile)
		if err != nil {
			return fmt.Errorf("can't get absolute path for %s: %w", tmpFile, err)
		}
		if err := os.MkdirAll(filepath.Dir(tmpFile), 0755); err != nil {
			return fmt.Errorf("can't create dir for %s: %w", tmpFile, err)
		}

		var satelliteDataReader io.Reader

		if stat, err := os.Stat(tmpFile); err != nil || stat.Size() == 0 {
			log.Printf("downloading %s with hash %s", url, idStr)
			res, err := http.DefaultClient.Get(url)
			if err != nil {
				return fmt.Errorf("can't get file %s: %w", url, err)
			}
			if res.StatusCode != http.StatusOK {

				return fmt.Errorf("can't get file %s: %s", url, res.Status)
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
		}

		f, err := os.Open(tmpFile)
		if err != nil {
			return fmt.Errorf("can't open file %s: %w", tmpFile, err)
		}
		defer f.Close()
		satelliteDataReader = f

		m := &shared.SatelliteMetadata{
			ID:               id,
			InitialSourceURL: url,
		}
		if _, err := kvMetadata.Put(idStr, m.MustToJSON()); err != nil {
			return fmt.Errorf("can't put metadata into kv store: %w", err)
		}

		if _, err := rawDataStore.Put(&nats.ObjectMeta{Name: idStr}, satelliteDataReader); err != nil {
			return fmt.Errorf("can't put file %s into object store: %w", url, err)
		}

		if _, err := js.Publish(shared.JETSTREAM_SATELLITE_JOBS_CONVERT_RAW_TO_HIREZ, []byte(idStr)); err != nil {
			return fmt.Errorf("can't publish job to convert raw to highrez: %w", err)
		}
	}

	return nil
}

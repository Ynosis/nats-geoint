package datafromsatellites

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/ConnectEverything/sales-poc-accenture/pkg/shared"
	"github.com/nats-io/nats.go"
	"k8s.io/apimachinery/pkg/util/sets"
)

func PullDataFromSatellitesService(ctx context.Context) error {

	nc := shared.NewNATsClient(ctx)

	js, err := nc.JetStream()
	if err != nil {
		return fmt.Errorf("can't create JetStream context: %w", err)
	}

	if _, err := js.AddStream(&nats.StreamConfig{
		Name:     "SATELLITE_JOBS",
		Subjects: []string{shared.SATELLITE_JOBS + ".>"},
	}); err != nil {
		return fmt.Errorf("can't create stream: %w", err)
	}

	objectStore, err := js.ObjectStore(shared.BUCKET_RAW_DATA_FROM_SATELLITES)
	if err != nil {
		objectStore, err = js.CreateObjectStore(&nats.ObjectStoreConfig{
			Bucket:      shared.BUCKET_RAW_DATA_FROM_SATELLITES,
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

	existingRaw, err := objectStore.List()
	if err != nil && err != nats.ErrNoObjectsFound {
		return fmt.Errorf("can't list existing raw assets: %w", err)
	}
	existingRawSet := sets.New[string]()
	for _, x := range existingRaw {
		existingRawSet.Insert(x.Name)
	}

	for _, url := range videoURLs.Videos {
		if existingRawSet.Has(url) {
			continue
		}
		res, err := http.DefaultClient.Get(url)
		if err != nil {
			return fmt.Errorf("can't get file %s: %w", url, err)
		}

		if res.StatusCode != http.StatusOK {
			return fmt.Errorf("can't get file %s: %s", url, res.Status)
		}

		if _, err := objectStore.Put(&nats.ObjectMeta{Name: url}, res.Body); err != nil {
			return fmt.Errorf("can't put file %s into object store: %w", url, err)
		}

		if _, err := js.Publish(shared.SATELLITE_JOBS_CONVERT_RAW_TO_TIFFS, []byte(url)); err != nil {
			return fmt.Errorf("can't publish job to convert raw to tiffs: %w", err)
		}

	}

	return nil
}

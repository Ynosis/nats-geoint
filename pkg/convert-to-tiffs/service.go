package converttotiffs

import (
	"context"
	"fmt"
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

func Run(ctx context.Context) error {

	nc := shared.NewNATsClient(ctx)

	js, err := nc.JetStream()
	if err != nil {
		return fmt.Errorf("can't create JetStream context: %w", err)
	}

	b := backoff.NewExponentialBackOff()

	var rawObjectStore, tiffObjectStore nats.ObjectStore
	for rawObjectStore == nil || err != nil {
		rawObjectStore, err = js.ObjectStore(shared.OBJECT_STORE_BUCKET_RAW_DATA_FROM_SATELLITES)
		if err != nil {
			log.Printf("can't create object store context: %v", err)
			time.Sleep(b.NextBackOff())
		}
	}
	b.Reset()
	for tiffObjectStore == nil || err != nil {
		tiffObjectStore, err = js.CreateObjectStore(&nats.ObjectStoreConfig{
			Bucket:      shared.OBJECT_STORE_BUCKET_TIFFS_FROM_SATELLITES,
			Description: "TIFFs converted from raw data",
		})
		if err != nil {
			log.Printf("can't create object store context: %v", err)
			time.Sleep(b.NextBackOff())
		}
	}
	b.Reset()

	var metadataKVStore nats.KeyValue
	for metadataKVStore == nil || err != nil {
		metadataKVStore, err = js.KeyValue(shared.KEY_VALUE_STORE_BUCKET_SATELLITE_METADATA)
		if err != nil {
			log.Printf("can't create key value store context: %v", err)
			time.Sleep(b.NextBackOff())
		}
	}
	b.Reset()

	sub, err := js.PullSubscribe(
		shared.JETSTREAM_SATELLITE_JOBS_CONVERT_RAW_TO_TIFFS, "convert_to_tiffs",
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
				videoFeedID := string(msg.Data)
				log.Printf("Received message: %s", videoFeedID)

				if err := convertRawToTiffs(js, rawObjectStore, tiffObjectStore, metadataKVStore, videoFeedID); err != nil {
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

var (
	frameRegex      = regexp.MustCompile(`frame=\s*(?P<frame>\d*)`)
	resolutionRegex = regexp.MustCompile(`(?P<w>\d+\d+)x(?P<h>\d+\d+)`)
)

func convertRawToTiffs(
	js nats.JetStreamContext,
	rawObjectStore, tiffObjectStore nats.ObjectStore,
	metadataKVStore nats.KeyValue,
	videoFeedID string) error {
	tmpPath := fmt.Sprintf("./data/tmp/%s", videoFeedID)
	if err := os.MkdirAll(filepath.Dir(tmpPath), 0755); err != nil {
		return fmt.Errorf("can't create temp directory: %w", err)
	}

	if err := rawObjectStore.GetFile(videoFeedID, tmpPath); err != nil {
		return fmt.Errorf("can't get raw bytes from object store: %w", err)
	}

	tiffsDir := fmt.Sprintf("./data/generated/%s", videoFeedID[:len(videoFeedID)-len(filepath.Ext(videoFeedID))])
	if err := os.MkdirAll(tiffsDir, 0755); err != nil {
		return fmt.Errorf("can't create tiffs directory: %w", err)
	}

	rawCMD := fmt.Sprintf(
		`ffmpeg -i %s -v info -pix_fmt rgb24 -compression_algo lzw %s/%%05d.tiff`,
		tmpPath, tiffsDir,
	)
	log.Printf("Running command: %s", rawCMD)
	rawCMDParts := strings.Split(rawCMD, " ")
	cmd := exec.Command(rawCMDParts[0], rawCMDParts[1:]...)

	output, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("can't convert raw bytes to tiffs: %w", err)
	}

	log.Printf("Output: %s", output)

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
	m.FrameCount = lastFrame
	m.OrginalResolutionHeight = height
	m.OrginalResolutionWidth = width
	if _, err := metadataKVStore.Put(videoFeedID, m.MustToJSON()); err != nil {
		return fmt.Errorf("can't put metadata to key value store: %w", err)
	}

	lastUpdatedFrame := 0
	for lastUpdatedFrame != lastFrame {
		dirEntry, err := os.ReadDir(tiffsDir)
		if err != nil {
			return fmt.Errorf("can't read tiffs directory: %w", err)
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
				return fmt.Errorf("can't parse frame number from tiff file: %w", err)
			}

			if frame < lastUpdatedFrame {
				continue
			}

			tiffPath := fmt.Sprintf("%s/%s", tiffsDir, entry.Name())
			tiffBytes, err := os.ReadFile(tiffPath)
			if err != nil {
				return fmt.Errorf("can't read tiff file: %w", err)
			}
			tiffObjectStorePath := fmt.Sprintf("%s_%05d", videoFeedID, frame)

			if _, err := tiffObjectStore.PutBytes(tiffObjectStorePath, tiffBytes); err != nil {
				return fmt.Errorf("can't put tiff to object store: %w", err)
			}

			if _, err := js.Publish(shared.JETSTREAM_SATELLITE_JOBS_CONVERT_TIFFS_TO_WEB, []byte(tiffObjectStorePath)); err != nil {
				return fmt.Errorf("can't publish convert tiffs to web message: %w", err)
			}

			lastUpdatedFrame = frame
			log.Printf("Uploaded frame %05d from %s", frame, videoFeedID)
		}
	}

	return nil
}

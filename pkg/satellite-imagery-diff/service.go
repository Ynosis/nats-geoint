package satelliteimagerydiff

import (
	"bytes"
	"context"
	"fmt"
	"image/png"
	"log"
	"sync"

	"github.com/ConnectEverything/sales-poc-accenture/pkg/shared"
	"github.com/corona10/goimagehash"
	lru "github.com/hashicorp/golang-lru/v2"
	"github.com/nats-io/nats.go"
	"github.com/nats-io/nats.go/micro"
	"golang.org/x/sync/errgroup"
)

func Run(ctx context.Context) error {
	log.Printf("starting satellite-imagery-web-friendly service")
	defer log.Printf("exiting satellite-imagery-web-friendly service")

	type WebFriendStats struct {
		ImagesConverted int `json:"totalFullConverted,omitempty"`
		HashCacheSize   int `json:"totalHashCacheSize,omitempty"`
		HashCacheHits   int `json:"totalHashCacheHits,omitempty"`
		HashRequests    int `json:"totalHashRequests,omitempty"`
	}
	statsMu := sync.RWMutex{}
	stats := &WebFriendStats{}
	nc, _, err := shared.NewNATsClient(ctx, &micro.Config{
		Name:        "satellite-imagery-web-friendly",
		Version:     "0.0.1",
		Description: "Service to convert satellite imagery to web friendly images",
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

	// b := backoff.NewExponentialBackOff()

	// metadataKVStore, err := js.KeyValue(shared.KEY_VALUE_STORE_BUCKET_SATELLITE_METADATA)
	// if err != nil {
	// 	return fmt.Errorf("can't create key value store metadata context: %w", err)
	// }

	highrezObjectStore, err := js.ObjectStore(shared.OBJECT_STORE_BUCKET_HIREZ_FROM_SATELLITES)
	if err != nil {
		return fmt.Errorf("can't create object store hirez context: %w", err)
	}

	// webObjectStore, err := js.ObjectStore(shared.OBJECT_STORE_BUCKET_WEB_FRIENDLY_IMAGES)
	// if err != nil {
	// 	return fmt.Errorf("can't create object store web friendly context: %w", err)
	// }

	type ImageHashes struct {
		Average, Difference, Perception *goimagehash.ImageHash
	}
	hashCache, err := lru.New2Q[string, ImageHashes](128)
	if err != nil {
		return fmt.Errorf("can't create hash cache: %w", err)
	}

	sub, err := nc.Subscribe("satellite-imagery-diff", func(msg *nats.Msg) {

		res := &shared.SatelliteImageryDiffResponse{}

		handleErr := func(err error) {
			res.Error = err.Error()
			if err := msg.Respond(res.MustToJSON()); err != nil {
				log.Printf("can't respond to request: %v", err)
			}
		}

		// Parse the message
		req, err := shared.SatelliteImageryDiffRequestFromJSON(msg.Data)
		if err != nil {
			handleErr(fmt.Errorf("can't unmarshal request: %w", err))
			return
		}

		getHash := func(frame int) (*ImageHashes, error) {
			id := fmt.Sprintf("%d_%05d", req.VideoFeedID, frame)

			// Check if we have the hash in the cache
			if hashes, ok := hashCache.Get(id); ok {
				statsMu.Lock()
				stats.HashCacheHits++
				statsMu.Unlock()
				return &hashes, nil
			}

			fileBytes, err := highrezObjectStore.GetBytes(id)
			if err != nil {
				return nil, fmt.Errorf("can't get file: %w", err)
			}
			fileReader := bytes.NewReader(fileBytes)
			hirez, err := png.Decode(fileReader)
			if err != nil {
				return nil, fmt.Errorf("can't decode png: %w", err)
			}

			eg := errgroup.Group{}
			hash := ImageHashes{}

			eg.Go(func() (err error) {
				hash.Average, err = goimagehash.AverageHash(hirez)
				return
			})

			eg.Go(func() (err error) {
				hash.Difference, err = goimagehash.DifferenceHash(hirez)
				return
			})

			eg.Go(func() (err error) {
				hash.Perception, err = goimagehash.PerceptionHash(hirez)
				return
			})

			if err := eg.Wait(); err != nil {
				return nil, fmt.Errorf("can't get hashes: %w", err)
			}

			hashCache.Add(id, hash)

			statsMu.Lock()
			stats.HashCacheSize = hashCache.Len()
			statsMu.Unlock()

			// goimagehash.Hash
			return &hash, nil
		}

		var startFrame, endFrame *ImageHashes

		eg := errgroup.Group{}
		eg.Go(func() (err error) {
			startFrame, err = getHash(req.StartFrame)
			return
		})
		eg.Go(func() (err error) {
			endFrame, err = getHash(req.EndFrame)
			return
		})
		if err := eg.Wait(); err != nil {
			handleErr(fmt.Errorf("can't get hashes: %w", err))
			return
		}

		eg = errgroup.Group{}
		eg.Go(func() (err error) {
			res.Success.AverageDistance, err = startFrame.Average.Distance(endFrame.Average)
			return
		})
		eg.Go(func() (err error) {
			res.Success.DifferenceDistance, err = startFrame.Difference.Distance(endFrame.Difference)
			return
		})
		eg.Go(func() (err error) {
			res.Success.PerceptionDistance, err = startFrame.Perception.Distance(endFrame.Perception)
			return
		})
		if err := eg.Wait(); err != nil {
			handleErr(fmt.Errorf("can't get distances: %w", err))
			return
		}

		if err := msg.Respond(res.MustToJSON()); err != nil {
			log.Printf("can't respond to request: %v", err)
		}

		statsMu.Lock()
		stats.HashCacheHits++
		statsMu.Unlock()
	})
	if err != nil {
		return fmt.Errorf("can't subscribe to subject: %w", err)
	}
	defer sub.Drain()

	<-ctx.Done()
	return ctx.Err()
}

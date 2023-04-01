package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"runtime/pprof"

	embeddednats "github.com/ConnectEverything/sales-poc-accenture/pkg/embedded-nats"
	satelliteimagerydiff "github.com/ConnectEverything/sales-poc-accenture/pkg/satellite-imagery-diff"
	satelliteimageryhirez "github.com/ConnectEverything/sales-poc-accenture/pkg/satellite-imagery-hirez"
	satelliteimagerymetadata "github.com/ConnectEverything/sales-poc-accenture/pkg/satellite-imagery-metadata"
	satelliteimagerypullfeeds "github.com/ConnectEverything/sales-poc-accenture/pkg/satellite-imagery-pull-feeds"
	satelliteimagerywebfriendly "github.com/ConnectEverything/sales-poc-accenture/pkg/satellite-imagery-web-friendly"
	satellitetracking "github.com/ConnectEverything/sales-poc-accenture/pkg/satellite-tracking"
	"github.com/ConnectEverything/sales-poc-accenture/pkg/shared"
	"github.com/nats-io/nats.go"
	"golang.org/x/sync/errgroup"

	_ "net/http/pprof"
)

func main() {
	log.SetFlags(log.LstdFlags | log.Llongfile)

	log.Print("Satellite Demo starting...")
	defer log.Print("Satellite Demo stopped.")

	if err := run(context.Background()); err != nil {
		log.Fatalf("error running: %v", err)
	}
}

func run(ctx context.Context) error {

	// Server for pprof
	f, err := os.Create("cpu.prof")
	if err != nil {
		log.Fatal("could not create CPU profile: ", err)
	}
	defer f.Close() // error handling omitted for example
	if err := pprof.StartCPUProfile(f); err != nil {
		log.Fatal("could not start CPU profile: ", err)
	}
	defer pprof.StopCPUProfile()

	stage := os.Getenv("STAGE")
	if stage == "" {
		stage = "all"
	}

	tmpDir := filepath.Join(os.TempDir(), "satellite-demo")
	if err := os.MkdirAll(tmpDir, 0755); err != nil {
		return fmt.Errorf("can't create tmp dir: %w", err)
	}

	if stage == "all" {
		os.Setenv("NATS_SERVER_URL", "nats://localhost:4222")

		natsSrv, err := embeddednats.NewNatsEmbeddedNATsServer(ctx, true)
		if err != nil {
			return fmt.Errorf("can't create NATsEmbeddedNATsServer: %w", err)
		}
		defer natsSrv.Close()
		natsSrv.WaitForServer()
	}

	if err := createStreams(ctx); err != nil {
		return fmt.Errorf("can't create streams: %w", err)
	}

	eg, setupCtx := errgroup.WithContext(ctx)

	// if stage == "all" || stage == "frontend" {
	// 	eg.Go(func() error {
	// 		return frontendserver.Run(setupCtx)
	// 	})
	// }

	if stage == "all" || stage == "imagery" || stage == "imagery-metadata" {
		eg.Go(func() error {
			return satelliteimagerymetadata.Run(setupCtx)
		})
	}

	if stage == "all" || stage == "imagery" || stage == "imagery-pull-feeds" {
		eg.Go(func() error {
			return satelliteimagerypullfeeds.Run(setupCtx, tmpDir)
		})
	}

	if stage == "all" || stage == "imagery" || stage == "imagery-hirez" {
		eg.Go(func() error {
			return satelliteimageryhirez.Run(setupCtx, tmpDir)
		})
	}

	if stage == "all" || stage == "imagery" || stage == "imagery-web-friendly" {
		for i := 0; i < 4; i++ {
			eg.Go(func() error {
				return satelliteimagerywebfriendly.Run(setupCtx, tmpDir)
			})
		}
	}

	if stage == "all" || stage == "imagery" || stage == "imagery-diff" {
		eg.Go(func() error {
			return satelliteimagerydiff.Run(setupCtx)
		})
	}

	if stage == "all" || stage == "tracking" {
		eg.Go(func() error {
			return satellitetracking.Run(setupCtx)
		})
	}

	if err := eg.Wait(); err != nil {
		return fmt.Errorf("error running services: %w", err)
	}

	return nil
}

func createStreams(ctx context.Context) error {

	nc, _, _ := shared.NewNATsClient(ctx, nil)
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

	// Create NATs streams
	type streamsInfo struct {
		Bucket      string
		Description string
		Type        string
	}
	streams := []streamsInfo{
		{
			Bucket:      shared.OBJECT_STORE_BUCKET_RAW_DATA_FROM_SATELLITES,
			Description: "Raw data from satellites, faked with mp4 files for now",
			Type:        "object_store",
		},
		{
			Bucket:      shared.OBJECT_STORE_BUCKET_HIREZ_FROM_SATELLITES,
			Description: "TIFFs converted from raw data",
			Type:        "object_store",
		},
		{
			Bucket:      shared.KEY_VALUE_STORE_BUCKET_SATELLITE_METADATA,
			Description: "Metadata about satellites",
			Type:        "key_value_store",
		},
		{
			Bucket:      shared.OBJECT_STORE_BUCKET_WEB_FRIENDLY_IMAGES,
			Description: "Web friendly images converted from Hi Rez images",
			Type:        "object_store",
		},
	}
	for _, stream := range streams {
		switch stream.Type {
		case "object_store":
			if _, err := js.CreateObjectStore(&nats.ObjectStoreConfig{
				Bucket:      stream.Bucket,
				Description: stream.Description,
			}); err != nil {
				return fmt.Errorf("can't create object store: %w", err)
			}
		case "key_value_store":
			if _, err := js.CreateKeyValue(&nats.KeyValueConfig{
				Bucket:      stream.Bucket,
				Description: stream.Description,
			}); err != nil {
				return fmt.Errorf("can't create key value store: %w", err)
			}
		default:
			return fmt.Errorf("unknown stream type: %s", stream.Type)
		}
	}

	return nil
}

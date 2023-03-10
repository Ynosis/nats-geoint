package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"runtime/pprof"

	embeddednats "github.com/ConnectEverything/sales-poc-accenture/pkg/embedded-nats"
	satelliteimageryhirez "github.com/ConnectEverything/sales-poc-accenture/pkg/satellite-imagery-hirez"
	satelliteimagerymetadata "github.com/ConnectEverything/sales-poc-accenture/pkg/satellite-imagery-metadata"
	satelliteimagerypullfeeds "github.com/ConnectEverything/sales-poc-accenture/pkg/satellite-imagery-pull-feeds"
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

		natsSrv, err := embeddednats.NewNatsEmbeddedNATsServer(ctx)
		if err != nil {
			return fmt.Errorf("can't create NATsEmbeddedNATsServer: %w", err)
		}
		defer natsSrv.Close()
		natsSrv.WaitForServer()
	}

	eg, setupCtx := errgroup.WithContext(ctx)

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

	// if stage == 0 || stage == 3 {
	// 	eg.Go(func() error {
	// 		return converttowebfriendly.Run(setupCtx)
	// 	})
	// }

	// if stage == 0 || stage == 4 {
	// 	eg.Go(func() error {
	// 		return satellitetracking.Run(setupCtx)
	// 	})
	// }

	if err := eg.Wait(); err != nil {
		return fmt.Errorf("error running services: %w", err)
	}

	return nil
}

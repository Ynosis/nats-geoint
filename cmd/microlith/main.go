package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"runtime/pprof"
	"strconv"

	converttohirez "github.com/ConnectEverything/sales-poc-accenture/pkg/convert-to-hirez"
	converttowebfriendly "github.com/ConnectEverything/sales-poc-accenture/pkg/convert-to-web-friendly"
	datafromsatellites "github.com/ConnectEverything/sales-poc-accenture/pkg/data-from-satellites"
	embeddednats "github.com/ConnectEverything/sales-poc-accenture/pkg/embedded-nats"
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

	stageRaw := os.Getenv("STAGE")
	if stageRaw == "" {
		stageRaw = "0"
	}
	stage, err := strconv.Atoi(stageRaw)
	if err != nil {
		return fmt.Errorf("can't parse STAGE: %w", err)
	}

	if stage == 0 {
		os.Setenv("NATS_SERVER_URL", "nats://localhost:4222")

		natsSrv, err := embeddednats.NewNatsEmbeddedNATsServer(ctx)
		if err != nil {
			return fmt.Errorf("can't create NATsEmbeddedNATsServer: %w", err)
		}
		defer natsSrv.Close()
		natsSrv.WaitForServer()
	}

	eg, setupCtx := errgroup.WithContext(ctx)

	if stage == 0 || stage == 1 {
		eg.Go(func() error {
			return datafromsatellites.Run(setupCtx)
		})
	}

	if stage == 0 || stage == 2 {
		eg.Go(func() error {
			return converttohirez.Run(setupCtx)
		})
	}

	if stage == 0 || stage == 3 {
		eg.Go(func() error {
			return converttowebfriendly.Run(setupCtx)
		})
	}

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

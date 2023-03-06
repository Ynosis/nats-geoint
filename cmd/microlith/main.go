package main

import (
	"context"
	"fmt"
	"log"

	hirez "github.com/ConnectEverything/sales-poc-accenture/pkg/convert-to-hirez"
	converttowebfriendly "github.com/ConnectEverything/sales-poc-accenture/pkg/convert-to-web-friendly"
	datafromsatellites "github.com/ConnectEverything/sales-poc-accenture/pkg/data-from-satellites"
	embeddednats "github.com/ConnectEverything/sales-poc-accenture/pkg/embedded-nats"
	"golang.org/x/sync/errgroup"
)

func main() {
	log.SetFlags(log.LstdFlags | log.Llongfile)

	log.Print("Accenture Demo starting...")
	defer log.Print("Accenture Demo stopped.")

	if err := run(context.Background()); err != nil {
		log.Fatal(err)
	}

}

func run(ctx context.Context) error {
	natsSrv, err := embeddednats.NewNatsEmbeddedNATsServer(ctx)
	if err != nil {
		return fmt.Errorf("can't create NATsEmbeddedNATsServer: %w", err)
	}
	defer natsSrv.Close()

	natsSrv.WaitForServer()

	eg, setupCtx := errgroup.WithContext(ctx)

	eg.Go(func() error {
		return hirez.Run(setupCtx)
	})

	eg.Go(func() error {
		return datafromsatellites.Run(setupCtx)
	})

	eg.Go(func() error {
		return converttowebfriendly.Run(setupCtx)
	})

	// eg.Go(func() error {
	// 	return frontend.Run(ctx)
	// })

	if err := eg.Wait(); err != nil {
		return fmt.Errorf("error running services: %w", err)
	}

	return nil
}

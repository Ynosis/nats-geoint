package frontendserver

import (
	"context"
	"embed"
	"fmt"
	"io/fs"
	"log"
	"net/http"
	"os"

	"github.com/ConnectEverything/sales-poc-accenture/pkg/shared"
	"github.com/nats-io/nats.go"
)

//go:embed www
var staticFiles embed.FS

func Run(ctx context.Context) error {

	nc, _, err := shared.NewNATsClient(ctx, nil)
	if err != nil {
		return fmt.Errorf("can't create NATs client: %w", err)
	}
	nc.Subscribe("kill-container", func(msg *nats.Msg) {
		os.Exit(0)
	})

	var staticFS = fs.FS(staticFiles)
	fileContent, err := fs.Sub(staticFS, "www")
	if err != nil {
		log.Fatal(err)
	}
	fs := http.FileServer(http.FS(fileContent))

	// Serve static files
	http.Handle("/", fs)

	port := os.Getenv("PORT")
	if port == "" {
		port = "80"
	}

	log.Printf("Listening on :%s...\n", port)
	err = http.ListenAndServe(fmt.Sprintf(":%s", port), nil)
	if err != nil {
		log.Fatal(err)
	}

	return nil
}

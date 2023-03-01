package shared

import (
	"context"
	"log"
	"os"

	"github.com/nats-io/nats.go"
)

func NewNATsClient(ctx context.Context) (nc *nats.Conn) {

	natsServerURL, exists := os.LookupEnv("NATS_SERVER_URL")
	if !exists {
		natsServerURL = "nats://localhost:4222"
	}

	var err error
	for nc == nil {
		nc, err = nats.Connect(natsServerURL)
		if err != nil {
			log.Printf("can't connect to NATs server: %v", err)
		}
	}

	return nc
}

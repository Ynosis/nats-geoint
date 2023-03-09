package shared

import (
	"context"
	"log"
	"os"
	"time"

	"github.com/nats-io/nats.go"
)

func NewNATsClient(ctx context.Context) (nc *nats.Conn) {

	natsServerURL, exists := os.LookupEnv("NATS_SERVER_URL")
	if !exists {
		panic("NATS_SERVER_URL not set")
	}

	var err error
	for nc == nil {
		opts := nats.Options{
			Url:              natsServerURL,
			AllowReconnect:   true,
			MaxReconnect:     -1,
			ReconnectWait:    5 * time.Second,
			Timeout:          5 * time.Second,
			ReconnectBufSize: 128 * 1024 * 1024,
		}
		nc, err = opts.Connect()
		if err != nil {
			log.Printf("can't connect to NATs server: %v", err)
		}
	}

	return nc
}

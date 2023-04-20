package shared

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/nats-io/nats.go"
	"github.com/nats-io/nats.go/micro"
)

func NewNATsClient(ctx context.Context, cfg *micro.Config) (nc *nats.Conn, svc *micro.Service, err error) {

	natsServerURL, exists := os.LookupEnv("NATS_SERVER_URL")
	if !exists {
		natsServerURL = nats.DefaultURL
	}

	opts := nats.Options{
		Url:              natsServerURL,
		AllowReconnect:   true,
		MaxReconnect:     -1,
		ReconnectWait:    30 * time.Minute,
		Timeout:          30 * time.Minute,
		ReconnectBufSize: 128 * 1024 * 1024,
	}
	nc, err = opts.Connect()
	if err != nil {
		log.Printf("can't connect to NATs server: %v", err)
	}

	if cfg != nil {
		s, err := micro.AddService(nc, *cfg)
		if err != nil {
			return nil, nil, fmt.Errorf("can't add service: %w", err)
		}
		log.Printf("service '%s' registered", cfg.Name)
		svc = &s
	}

	return
}

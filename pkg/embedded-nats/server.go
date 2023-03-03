package embeddednats

import (
	"context"
	"log"

	"github.com/cenkalti/backoff/v4"
	"github.com/nats-io/nats-server/v2/server"
)

type NATsEmbeddedNATsServer struct {
	ns *server.Server
}

func NewNatsEmbeddedNATsServer(ctx context.Context) (*NATsEmbeddedNATsServer, error) {
	// Initialize new server with options
	ns, err := server.NewServer(&server.Options{
		JetStream: true,
		StoreDir:  "./data/microlith-data",
		Websocket: server.WebsocketOpts{
			Port:  4443,
			NoTLS: true,
		},
	})

	if err != nil {
		panic(err)
	}

	// Start the server via goroutine
	ns.Start()

	return &NATsEmbeddedNATsServer{
		ns: ns,
	}, nil
}

func (n *NATsEmbeddedNATsServer) Close() error {
	if n.ns != nil {
		n.ns.Shutdown()
	}
	return nil
}

func (n *NATsEmbeddedNATsServer) WaitForServer() {
	b := backoff.NewExponentialBackOff()

	for {
		d := b.NextBackOff()
		ready := n.ns.ReadyForConnections(d)
		if ready {
			break
		}

		log.Printf("NATS server not ready, waited %s, retrying...", d)
	}
}

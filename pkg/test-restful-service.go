package pkg

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/ConnectEverything/sales-poc-accenture/pkg/shared"
	"github.com/nats-io/nats.go/micro"
)

type RESTMsg struct {
	PiTag string  `json:"piTag"`
	Temp  float32 `json:"temp"`
}

type GAAPI struct {
	Type       string                 `json:"type"`
	ID         string                 `json:"id"`
	Attributes map[string]interface{} `json:"attributes"`
}

func Run(ctx context.Context, tmpDir string) error {
	nc, _, err := shared.NewNATsClient(ctx, &micro.Config{
		Name:    "REST API puller",
		Version: "0.0.1",
	})
	if err != nil {
		return fmt.Errorf("can't create NATs client: %w", err)
	}

	i := 0
loop:
	for {
		select {
		case <-ctx.Done():
			break loop
		default:
			url := fmt.Sprintf("https://dummyjson.com/quotes?limit=1&skip=%d", i)
			res, err := http.DefaultClient.Get(url)
			if err != nil {
				return fmt.Errorf("error getting data: %w", err)
			}
			defer res.Body.Close()

			buf := bytes.Buffer{}
			buf.ReadFrom(res.Body)

			in := &RESTMsg{}
			json.Unmarshal(buf.Bytes(), in)

			out := &GAAPI{
				Type: "MQTT IOT DEVICE",
				ID:   in.PiTag,
				Attributes: map[string]interface{}{
					"temp": in.Temp,
				},
			}

			b, err := json.Marshal(out)
			if err != nil {
				return fmt.Errorf("error marshaling: %w", err)
			}

			nc.Publish("foo.bar.baz", b)
		}
	}

	return nil
}

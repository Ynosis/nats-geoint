package satellitetracking

import (
	"context"
	_ "embed"
	"fmt"
	"strings"
	"time"

	"github.com/ConnectEverything/sales-poc-accenture/pkg/shared"
	sgp4 "github.com/SharkEzz/sgp4"
	"github.com/goccy/go-json"
	"github.com/nats-io/nats.go"
	"github.com/nats-io/nats.go/micro"
	"github.com/pinzolo/casee"
)

//go:embed active.tle
var activeTLE string

//go:embed active.json
var activeJSON string

type satelliteMetadata struct {
	ID                 string  `json:"OBJECT_ID,omitempty"`
	Name               string  `json:"OBJECT_NAME,omitempty"`
	Epoch              string  `json:"EPOCH,omitempty"`
	MeanMotion         float64 `json:"MEAN_MOTION,omitempty"`
	Eccentricity       float64 `json:"ECCENTRICITY,omitempty"`
	Inclination        float64 `json:"INCLINATION,omitempty"`
	RaOfAscNode        float64 `json:"RA_OF_ASC_NODE,omitempty"`
	ArgOfPericenter    float64 `json:"ARG_OF_PERICENTER,omitempty"`
	MeanAnomaly        float64 `json:"MEAN_ANOMALY,omitempty"`
	EphemerisType      int64   `json:"EPHEMERIS_TYPE,omitempty"`
	ClassificationType string  `json:"CLASSIFICATION_TYPE,omitempty"`
	NoradCatId         int64   `json:"NORAD_CAT_ID,omitempty"`
	ElementSetNo       int64   `json:"ELEMENT_SET_NO,omitempty"`
	RevAtEpoch         int64   `json:"REV_AT_EPOCH,omitempty"`
	Bstar              float64 `json:"BSTAR,omitempty"`
	MeanMotionDot      float64 `json:"MEAN_MOTION_DOT,omitempty"`
	MeanMotionDdot     float64 `json:"MEAN_MOTION_DDOT,omitempty"`
}

type satallite struct {
	ID   string
	Name string
	// TLE  sat.Satellite
	TLE  *sgp4.TLE
	SGP4 *sgp4.SGP4
}

type position struct {
	LongitudeDeg float64 `json:"longitudeDeg,omitempty"`
	LatitudeDeg  float64 `json:"latitudeDeg,omitempty"`
	AltitudeKm   float64 `json:"altitudeKm,omitempty"`
}

func Run(ctx context.Context) error {
	nc, _, err := shared.NewNATsClient(ctx, &micro.Config{
		Name:        "satallite-tracking",
		Version:     "0.0.1",
		Description: "Generate telemetry for satallites from TLE data",
	})
	if err != nil {
		return fmt.Errorf("can't create NATs client: %w", err)
	}

	js, err := nc.JetStream()
	if err != nil {
		return fmt.Errorf("can't get jetstream: %w", err)
	}

	kv, err := js.CreateKeyValue(&nats.KeyValueConfig{
		Bucket: "SatelliteTrackingMetadata",
	})
	if err != nil {
		return fmt.Errorf("can't create kv: %w", err)
	}

	time.Sleep(1 * time.Second)
	metadata := []satelliteMetadata{}
	if err := json.Unmarshal([]byte(activeJSON), &metadata); err != nil {
		return fmt.Errorf("can't unmarshal active.json: %w", err)
	}
	for _, m := range metadata {
		b, err := json.Marshal(m)
		if err != nil {
			return fmt.Errorf("can't marshal metadata: %w", err)
		}
		kv.Put(casee.ToChainCase(m.ID), b)
	}

	rows := strings.Split(activeTLE, "\n")
	satallites := make([]satallite, 0, len(rows)/3)
	for i := 0; i < len(rows); i += 3 {
		name := strings.TrimSpace(rows[i])
		if name == "" {
			break
		}

		prefix := name
		if idx := strings.Index(prefix, "*"); idx != -1 {
			prefix = prefix[:idx]
		}

		id := ""
		for j, m := range metadata {
			if strings.HasPrefix(m.Name, prefix) {
				name = m.Name
				id = casee.ToChainCase(m.ID)

				// remove metadata from search
				metadata = append(metadata[:j], metadata[j+1:]...)

				break
			}
		}

		// if id == "" {
		// 	log.Printf("no metadata found for %q", name)
		// }

		line1 := rows[i+1]
		line2 := rows[i+2]
		tle, err := sgp4.NewTLE(id, line1, line2)
		if err != nil {
			return fmt.Errorf("can't parse tle: %w", err)
		}
		if tle == nil {
			return fmt.Errorf("can't parse tle: nil")
		}

		sgp4, err := sgp4.NewSGP4(tle)
		if err != nil {
			return fmt.Errorf("can't create sgp4: %w", err)
		}

		s := satallite{
			ID:   id,
			Name: name,
			TLE:  tle,
			SGP4: sgp4,
		}
		satallites = append(satallites, s)
	}

	satallites = satallites[:1000]

	// log.Printf("found %d satallites", len(satallites))

	satTrackingSubjectPrefix := "sat.tracking"

	maxMsgsPerSubject := int64(100)

	if err := js.DeleteStream("SatelliteTracking"); err != nil && err != nats.ErrStreamNotFound {
		return fmt.Errorf("can't delete stream: %w", err)
	}

	if _, err := js.AddStream(&nats.StreamConfig{
		Name:              "SatelliteTracking",
		Subjects:          []string{satTrackingSubjectPrefix + ".>"},
		MaxMsgsPerSubject: maxMsgsPerSubject,
		Retention:         nats.LimitsPolicy,
		Discard:           nats.DiscardOld,
		Storage:           nats.FileStorage,
	}); err != nil && err != nats.ErrStreamNameAlreadyInUse {
		return fmt.Errorf("can't create stream: %w", err)
	}

	var p position
	t := time.NewTicker(1000 * time.Millisecond)
	defer t.Stop()
	for {
		select {
		case <-ctx.Done():
			return ctx.Err()
		case <-t.C:
			now := time.Now()

			// s := satallites[rand.Intn(len(satallites))]

			for _, s := range satallites {
				lat, lng, alt, err := s.SGP4.Position(now)
				if err != nil {
					// return fmt.Errorf("can't get position: %w", err)
					continue
				}

				p.LongitudeDeg = lng
				p.LatitudeDeg = lat
				p.AltitudeKm = alt
				b, _ := json.Marshal(p)
				// log.Print(len(b))
				subject := fmt.Sprintf("%s.%s", satTrackingSubjectPrefix, s.ID)
				if _, err := js.PublishAsync(subject, b); err != nil {
					return fmt.Errorf("can't publish: %w", err)
				}

				// log.Print(i)
			}

			// took := time.Since(now)
			// log.Printf("%d positions in %s", len(satallites), took)
		}
	}
}

const (
	secondsInADay      = 86400
	UnixEpochJulianDay = 2440587.5
)

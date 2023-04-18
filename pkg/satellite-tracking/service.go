package satellitetracking

import (
	"context"
	_ "embed"
	"fmt"
	"math"
	"strings"
	"time"

	"github.com/ConnectEverything/sales-poc-accenture/pkg/shared"
	"github.com/goccy/go-json"
	sat "github.com/jsmorph/go-satellite"
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
	TLE  sat.Satellite
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
		tle, err := sat.ParseTLE(line1, line2, "wgs84")
		if err != nil {
			return fmt.Errorf("can't parse tle: %w", err)
		}
		if tle == nil {
			return fmt.Errorf("can't parse tle: nil")
		}

		s := satallite{
			ID:   id,
			Name: name,
			TLE:  *tle,
		}
		satallites = append(satallites, s)
	}

	satallites = satallites[:1000]

	// log.Printf("found %d satallites", len(satallites))

	satTrackingSubjectPrefix := "sat.tracking"

	// maxMsgsPerSubject := int64(8000)

	if err := js.DeleteStream("SatelliteTracking"); err != nil && err != nats.ErrStreamNotFound {
		return fmt.Errorf("can't delete stream: %w", err)
	}

	if _, err := js.AddStream(&nats.StreamConfig{
		Name:     "SatelliteTracking",
		Subjects: []string{satTrackingSubjectPrefix + ".>"},
		// MaxMsgsPerSubject: maxMsgsPerSubject,
		Retention: nats.LimitsPolicy,
		Discard:   nats.DiscardOld,
		Storage:   nats.FileStorage,
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
			jd := timeToJulianDay(now)
			gmst := sat.ThetaG_JD(jd)

			// s := satallites[rand.Intn(len(satallites))]

			for _, s := range satallites {
				eci, _ := sat.PropagateJDay(s.TLE, jd)
				alt, _, llRad := sat.ECIToLLA(eci, gmst)
				ll, err := sat.LatLongDeg(llRad)
				if err != nil {
					return fmt.Errorf("can't convert to lat long: %w", err)
				}

				p.LongitudeDeg = ll.Longitude
				p.LatitudeDeg = ll.Latitude
				p.AltitudeKm = math.Abs(alt)
				b, _ := json.Marshal(p)
				// log.Print(len(b))
				subject := fmt.Sprintf("%s.%s", satTrackingSubjectPrefix, s.ID)
				if _, err := js.PublishAsync(subject, b); err != nil {
					return fmt.Errorf("can't publish: %w", err)
				}
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

// timeToJulianDay converts a time.Time into a Julian day.
func timeToJulianDay(t time.Time) float64 {
	return float64(t.UTC().Unix())/secondsInADay + UnixEpochJulianDay
}

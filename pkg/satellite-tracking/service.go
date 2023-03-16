package satellitetracking

import (
	"context"
	_ "embed"
	"fmt"
	"log"
	"math"
	"math/rand"
	"strings"
	"time"

	"github.com/ConnectEverything/sales-poc-accenture/pkg/shared"
	"github.com/goccy/go-json"
	sat "github.com/joshuaferrara/go-satellite"
	"github.com/nats-io/nats.go"
	"github.com/pinzolo/casee"
)

//go:embed active.tle
var activeTLE string

//go:embed active.json
var activeJSON string

type satelliteMetadata struct {
	ID   string `json:"OBJECT_ID"`
	Name string `json:"OBJECT_NAME"`
}

type satallite struct {
	ID   string
	Name string
	TLE  sat.Satellite
}

type position struct {
	LongitudeDeg float64
	LatitudeDeg  float64
	AltitudeKm   float64
}

func Run(ctx context.Context) error {
	time.Sleep(1 * time.Second)
	metadata := []satelliteMetadata{}
	if err := json.Unmarshal([]byte(activeJSON), &metadata); err != nil {
		return fmt.Errorf("can't unmarshal active.json: %w", err)
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

		if id == "" {
			log.Printf("no metadata found for %q", name)
		}

		line1 := rows[i+1]
		line2 := rows[i+2]
		tle := sat.ParseTLE(line1, line2, sat.GravityWGS84)

		s := satallite{
			ID:   id,
			Name: name,
			TLE:  tle,
		}
		satallites = append(satallites, s)
	}

	log.Printf("found %d satallites", len(satallites))

	nc := shared.NewNATsClient(ctx)
	var p position

	t := time.NewTicker(100 * time.Millisecond)
	defer t.Stop()

	js, err := nc.JetStream()
	if err != nil {
		return fmt.Errorf("can't get jetstream: %w", err)
	}

	satTrackingSubjectPrefix := "sat.tracking"

	// maxMsgsPerSubject := int64(8000)

	if err := js.DeleteStream("SatalliteTracking"); err != nil && err != nats.ErrStreamNotFound {
		return fmt.Errorf("can't delete stream: %w", err)
	}

	if _, err := js.AddStream(&nats.StreamConfig{
		Name:     "SatalliteTracking",
		Subjects: []string{satTrackingSubjectPrefix + ".>"},
		// MaxMsgsPerSubject: maxMsgsPerSubject,
		Retention: nats.LimitsPolicy,
		Discard:   nats.DiscardOld,
		Storage:   nats.FileStorage,
	}); err != nil && err != nats.ErrStreamNameAlreadyInUse {
		return fmt.Errorf("can't create stream: %w", err)
	}

	for {
		select {
		case <-ctx.Done():
			return ctx.Err()
		case <-t.C:
			now := time.Now()
			jd := timeToJulianDay(now)

			gmst := sat.ThetaG_JD(jd)

			year := now.Year()
			month := int(now.Month())
			day := now.Day()
			hour := now.Hour()
			minute := now.Minute()
			second := now.Second()

			s := satallites[rand.Intn(len(satallites))]

			// for _, s := range satallites {
			eci, _ := sat.Propagate(s.TLE, year, month, day, hour, minute, second)
			alt, _, llRad := sat.ECIToLLA(eci, gmst)
			ll := sat.LatLongDeg(llRad)

			p.LongitudeDeg = ll.Longitude
			p.LatitudeDeg = ll.Latitude
			p.AltitudeKm = math.Abs(alt)
			b, _ := json.Marshal(p)
			// log.Print(len(b))
			// subject := fmt.Sprintf("%s.%s", satTrackingSubjectPrefix, s.ID)
			subject := fmt.Sprintf("%s.sats", satTrackingSubjectPrefix) // For @derek

			if _, err := js.PublishAsync(subject, b); err != nil {
				return fmt.Errorf("can't publish: %w", err)
			}
			// }

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

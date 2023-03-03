package frontend

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/ConnectEverything/sales-poc-accenture/pkg/shared"
	"github.com/cenkalti/backoff"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/render"
	"github.com/nats-io/nats.go"

	g "github.com/maragudk/gomponents"
	. "github.com/maragudk/gomponents/html"
)

func Run(ctx context.Context) error {
	nc := shared.NewNATsClient(ctx)

	js, err := nc.JetStream()
	if err != nil {
		return fmt.Errorf("can't create JetStream context: %w", err)
	}

	b := backoff.NewExponentialBackOff()

	var webObjectStore nats.ObjectStore
	for webObjectStore == nil || err != nil {
		webObjectStore, err = js.ObjectStore(shared.OBJECT_STORE_BUCKET_WEB_FRIENDLY_IMAGES)
		if err != nil {
			log.Printf("can't create object store context: %v", err)
			time.Sleep(b.NextBackOff())
		}
	}
	b.Reset()

	var kvMetadata nats.KeyValue
	for kvMetadata == nil || err != nil {
		kvMetadata, err = js.KeyValue(shared.KEY_VALUE_STORE_BUCKET_SATELLITE_METADATA)
		if err != nil {
			log.Printf("can't create key value store context: %v", err)
			time.Sleep(b.NextBackOff())
		}
	}
	b.Reset()

	router := chi.NewRouter()

	router.Get("/", func(w http.ResponseWriter, r *http.Request) {
		if err := HTML(
			Head(
				TitleEl(g.Text("Frontend")),
			),
			Body(
				H1(g.Text("Frontend!!")),
				P(
					g.Text("Click "),
					A(g.Attr("href", "/metadata"), g.Text("here")),
					g.Text(" to see metadata."),
				),
				P(
					g.Text("Click "),
					A(g.Attr("href", "/image"), g.Text("here")),
					g.Text(" to see an image."),
				),
			),
		).Render(w); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	})

	router.Get("/metadata", func(w http.ResponseWriter, r *http.Request) {

		metadatas := []*shared.SatelliteMetadata{}
		keys, err := kvMetadata.Keys()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		for _, key := range keys {
			entry, err := kvMetadata.Get(key)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			m := shared.MustSatelliteMetadataFromJSON(entry.Value())
			metadatas = append(metadatas, m)
		}

		render.JSON(w, r, metadatas)
	})

	setupImages(webObjectStore, router)

	srv := &http.Server{
		Addr:    ":8080",
		Handler: router,
	}

	go func() {
		<-ctx.Done()
		srv.Shutdown(ctx)
	}()

	log.Printf("frontend service listening on %s", srv.Addr)
	return srv.ListenAndServe()
}

func setupImages(webObjectStore nats.ObjectStore, router *chi.Mux) {
	imageHandler := func(w http.ResponseWriter, r *http.Request, isThumbnail bool) {
		id := chi.URLParam(r, "id")
		frameRaw := chi.URLParam(r, "frame")
		frame, err := strconv.Atoi(frameRaw)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		key := fmt.Sprintf("%s/%05d", id, frame)
		if isThumbnail {
			key = fmt.Sprintf("%s/thumbnail", key)
		}
		entry, err := webObjectStore.GetBytes(key)
		if err != nil {
			if err == nats.ErrObjectNotFound {
				http.Error(w, "thumbnail not availble yet", http.StatusNotFound)
				return
			}
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "image/png")
		w.Header().Set("Content-Length", strconv.Itoa(len(entry)))
		w.Write(entry)
	}

	router.Get("/images/{id}/{frame}", func(w http.ResponseWriter, r *http.Request) {
		imageHandler(w, r, false)
	})

	router.Get("/thumbnails/{id}/{frame}", func(w http.ResponseWriter, r *http.Request) {
		imageHandler(w, r, true)
	})
}

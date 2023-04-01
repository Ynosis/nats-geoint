package satelliteimageryhirez

import (
	"context"
	"fmt"
	"log"
	"math/rand"
	"net"
	"os"
	"path"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/ConnectEverything/sales-poc-accenture/pkg/shared"
	"github.com/Jeffail/gabs/v2"
	"github.com/cenkalti/backoff/v4"
	"github.com/nats-io/nats.go"
	"github.com/nats-io/nats.go/micro"
	ffmpeg "github.com/u2takey/ffmpeg-go"
	"golang.org/x/exp/slices"
)

func Run(ctx context.Context, tmpDir string) error {
	log.Printf("starting satellite-imagery-hirez service")
	defer log.Printf("exiting satellite-imagery-hirez service")

	type HiRezStats struct {
		VideosProcessed int `json:"videosProcessed"`
		AverageWidth    int `json:"averageWidth"`
		AverageHeight   int `json:"averageHeight"`
	}
	statsMu := sync.RWMutex{}
	stats := &HiRezStats{}
	nc, _, err := shared.NewNATsClient(ctx, &micro.Config{
		Name:        "satellite-imagery-hirez",
		Version:     "0.0.1",
		Description: "Service to convert video to high resolution images",
		StatsHandler: func(e *micro.Endpoint) interface{} {
			statsMu.RLock()
			defer statsMu.RUnlock()
			return stats
		},
	})
	if err != nil {
		return fmt.Errorf("can't create NATs client: %w", err)
	}

	js, err := nc.JetStream()
	if err != nil {
		return fmt.Errorf("can't create JetStream context: %w", err)
	}

	rawObjectStore, err := js.ObjectStore(shared.OBJECT_STORE_BUCKET_RAW_DATA_FROM_SATELLITES)
	if err != nil {
		return fmt.Errorf("can't create object store raw from satellites context: %w", err)
	}
	hirezObjectStore, err := js.ObjectStore(shared.OBJECT_STORE_BUCKET_HIREZ_FROM_SATELLITES)
	if err != nil {
		return fmt.Errorf("can't create object store hi rez from satellites context: %w", err)
	}
	metadataKVStore, err := js.KeyValue(shared.KEY_VALUE_STORE_BUCKET_SATELLITE_METADATA)
	if err != nil {
		return fmt.Errorf("can't create kv metadata context: %w", err)
	}

	sub, err := js.PullSubscribe(
		shared.JETSTREAM_SATELLITE_JOBS_CONVERT_RAW_TO_HIREZ, "convert_to_hirez",
		nats.AckWait(5*time.Minute), // Convert raw to hirez can take a while
	)
	if err != nil {
		return fmt.Errorf("can't subscribe to subject: %w", err)
	}

	hiRezTmpDir := filepath.Join(tmpDir, "hi_rez")
	if err := os.MkdirAll(hiRezTmpDir, 0755); err != nil {
		return fmt.Errorf("can't create temp directory: %w", err)
	}

	hiRezTmpFeedDir := filepath.Join(tmpDir, "feed")
	if err := os.MkdirAll(hiRezTmpFeedDir, 0755); err != nil {
		return fmt.Errorf("can't create temp directory: %w", err)
	}

	totalWidth, totalHeight, totalCount := 0, 0, 0

	convertRawToHirez := func(videoFeedID string) error {
		feedFile := fmt.Sprintf("%s/%s", hiRezTmpFeedDir, videoFeedID)
		if err := rawObjectStore.GetFile(videoFeedID, feedFile); err != nil {
			return fmt.Errorf("can't get raw bytes from object store: %w", err)
		}
		defer os.Remove(feedFile)

		hiRezImagesDir := filepath.Join(tmpDir, "images", videoFeedID)
		if err := os.MkdirAll(hiRezImagesDir, 0755); err != nil {
			return fmt.Errorf("can't create temp directory: %w", err)
		}
		defer os.RemoveAll(hiRezImagesDir)

		inProbeJSONStr, err := ffmpeg.Probe(feedFile)
		if err != nil {
			return fmt.Errorf("can't probe video feed: %w", err)
		}
		probe, err := gabs.ParseJSON([]byte(inProbeJSONStr))
		if err != nil {
			return fmt.Errorf("can't parse probe json: %w", err)
		}

		// log.Print(inProbeJSONStr)

		width := probe.Path("streams.0.width").Data().(float64)
		height := probe.Path("streams.0.height").Data().(float64)
		frameCountRaw := probe.Path("streams.0.nb_frames").Data().(string)
		frameCount, err := strconv.Atoi(frameCountRaw)
		if err != nil {
			return fmt.Errorf("can't convert frame count to int: %w", err)
		}

		for {
			metadataEntry, err := metadataKVStore.Get(videoFeedID)
			if err != nil {
				return fmt.Errorf("can't get metadata from key value store: %w", err)
			}
			m := shared.MustSatelliteMetadataFromJSON(metadataEntry.Value())
			m.HiRez.FrameCount = frameCount
			m.HiRez.OrginalResolutionWidth = int(width)
			m.HiRez.OrginalResolutionHeight = int(height)
			if _, err := metadataKVStore.Update(videoFeedID, m.MustToJSON(), metadataEntry.Revision()); err != nil {
				log.Printf("can't update metadata: %v, retrying", err)
			} else {
				break
			}
		}

		durationStr := probe.Path("format.duration").Data().(string)
		duration, err := strconv.ParseFloat(durationStr, 64)
		if err != nil {
			return fmt.Errorf("can't convert duration to float: %w", err)
		}

		tempSock := func() string {
			sockFileName := path.Join(os.TempDir(), fmt.Sprintf("%d_sock", rand.Int()))
			l, err := net.Listen("unix", sockFileName)
			if err != nil {
				panic(err)
			}

			go func() {
				re := regexp.MustCompile(`out_time_ms=(\d+)`)
				fd, err := l.Accept()
				if err != nil {
					log.Fatal("accept error:", err)
				}
				buf := make([]byte, 16)
				data := ""
				progress := ""
				for {
					_, err := fd.Read(buf)
					if err != nil {
						return
					}
					data += string(buf)
					a := re.FindAllStringSubmatch(data, -1)
					cp := ""
					if len(a) > 0 && len(a[len(a)-1]) > 0 {
						c, _ := strconv.Atoi(a[len(a)-1][len(a[len(a)-1])-1])
						cp = fmt.Sprintf("%.0f%%", float64(c)/duration/10000)
					}
					if strings.Contains(data, "progress=end") {
						cp = "done"
					}
					if cp == "" {
						cp = "0"
					}
					if cp != progress {
						progress = cp

						if progress == "0%" {
							continue
						}
						for {
							e, err := metadataKVStore.Get(videoFeedID)
							if err != nil {
								log.Printf("can't get metadata from key value store: %v", err)
								continue
							}

							m := shared.MustSatelliteMetadataFromJSON(e.Value())
							m.HiRez.ConversionProgress = progress
							if _, err := metadataKVStore.Update(videoFeedID, m.MustToJSON(), e.Revision()); err != nil {
								log.Printf("can't update metadata: %v, retrying", err)
							} else {
								break
							}
						}

						fmt.Println("progress: ", progress)
					}
				}
			}()

			return sockFileName
		}

		outputFmt := fmt.Sprintf("%s/%%05d.png", hiRezImagesDir)
		process := ffmpeg.Input(feedFile).
			Output(outputFmt,
				ffmpeg.KwArgs{
					"pix_fmt":          "rgb24",
					"compression_algo": "lzw",
					"filter:v":         "scale=2048:-1",
				},
			).
			GlobalArgs("-progress", "unix://"+tempSock()).
			OverWriteOutput()
		if err := process.Run(); err != nil {
			return fmt.Errorf("can't convert raw bytes to hirez: %w", err)
		}

		lastUpdatedFrame := 0
		for lastUpdatedFrame != frameCount {
			dirEntry, err := os.ReadDir(hiRezImagesDir)
			if err != nil {
				return fmt.Errorf("can't read hirez directory: %w", err)
			}

			slices.SortFunc(dirEntry, func(i, j os.DirEntry) bool {
				return i.Name() < j.Name()
			})

			for _, entry := range dirEntry {
				if entry.IsDir() {
					continue
				}

				frame, err := strconv.Atoi(entry.Name()[:len(entry.Name())-len(filepath.Ext(entry.Name()))])
				if err != nil {
					return fmt.Errorf("can't parse frame number from hirez file: %w", err)
				}

				if frame < lastUpdatedFrame {
					continue
				}

				hirezPath := fmt.Sprintf("%s/%s", hiRezImagesDir, entry.Name())
				hirezBytes, err := os.ReadFile(hirezPath)
				if err != nil {
					return fmt.Errorf("can't read hirez file: %w", err)
				}
				hirezObjectStorePath := fmt.Sprintf("%s_%05d", videoFeedID, frame)

				if _, err := hirezObjectStore.PutBytes(hirezObjectStorePath, hirezBytes); err != nil {
					return fmt.Errorf("can't put hirez to object store: %w", err)
				}

				if _, err := js.Publish(shared.JETSTREAM_SATELLITE_JOBS_CONVERT_HIREZ_TO_WEB, []byte(hirezObjectStorePath)); err != nil {
					return fmt.Errorf("can't publish convert hirez to web message: %w", err)
				}

				lastUpdatedFrame = frame

				// TODO: Talk to team about CAS
				metadataEntry, err := metadataKVStore.Get(videoFeedID)
				if err != nil {
					return fmt.Errorf("can't get metadata from key value store: %w", err)
				}
				m := shared.MustSatelliteMetadataFromJSON(metadataEntry.Value())
				m.HiRez.LastFrameUploaded = lastUpdatedFrame
				if _, err := metadataKVStore.Put(videoFeedID, m.MustToJSON()); err != nil {
					return fmt.Errorf("can't put metadata to key value store: %w", err)
				}

				totalWidth += m.HiRez.OrginalResolutionWidth
				totalHeight += m.HiRez.OrginalResolutionHeight
				totalCount++
				statsMu.Lock()
				stats.AverageWidth = totalWidth / totalCount
				stats.AverageHeight = totalHeight / totalCount
				statsMu.Unlock()
			}
		}

		statsMu.Lock()
		stats.VideosProcessed++
		statsMu.Unlock()

		return nil
	}

	b := backoff.NewExponentialBackOff()
	for {
		select {
		case <-ctx.Done():
			return nil
		default:
			msgs, err := sub.Fetch(1, nats.MaxWait(b.NextBackOff()))
			if err != nil && err != nats.ErrTimeout {
				return fmt.Errorf("can't fetch message: %w", err)
			}
			if len(msgs) == 0 {
				continue
			}
			b.Reset()

			for _, msg := range msgs {
				videoFeedID := string(msg.Data)
				log.Printf("Received message: %s", videoFeedID)

				if err := convertRawToHirez(videoFeedID); err != nil {
					log.Printf("can't convert raw bytes to hirez: %v", err)
					break
				}

				if err := msg.Ack(); err != nil {
					log.Printf("can't ack message: %v", err)
					break
				}
			}

		}
	}
}

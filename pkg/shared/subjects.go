package shared

const (
	KEY_VALUE_STORE_BUCKET_SATELLITE_METADATA = "satellite-metadata"

	OBJECT_STORE_BUCKET_RAW_DATA_FROM_SATELLITES = "raw-data-from-satellites"
	OBJECT_STORE_BUCKET_TIFFS_FROM_SATELLITES    = "tiffs-from-satellites"
	OBJECT_STORE_BUCKET_WEB_FRIENDLY_IMAGES      = "web-friendly-images"

	JETSTREAM_SATELLITE_JOBS                      = "satellites.jobs"
	JETSTREAM_SATELLITE_JOBS_CONVERT_RAW_TO_TIFFS = JETSTREAM_SATELLITE_JOBS + ".convert-raw-to-tiffs"
	JETSTREAM_SATELLITE_JOBS_CONVERT_TIFFS_TO_WEB = JETSTREAM_SATELLITE_JOBS + ".convert-tiffs-to-web"

	// RAW_DATA_FROM_SATELLITES_SUBJECT = "demo.satellites.raw"
)

package shared

const (
	BUCKET_RAW_DATA_FROM_SATELLITES     = "raw-data-from-satellites"
	SATELLITE_JOBS                      = "satellites.jobs"
	SATELLITE_JOBS_CONVERT_RAW_TO_TIFFS = SATELLITE_JOBS + ".convert-raw-to-tiffs"
	SATELLITE_JOBS_CONVERT_TIFFS_TO_WEB = SATELLITE_JOBS + ".convert-tiffs-to-web"

	BUCKET_TIFFS_FROM_SATELLITES = "tiffs-from-satellites"
	BUCKET_WEB_FRIENDLY_IMAGES   = "web-friendly-images"

	// RAW_DATA_FROM_SATELLITES_SUBJECT = "demo.satellites.raw"
)

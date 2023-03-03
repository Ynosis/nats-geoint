import { connect } from 'nats.ws'

export const KEY_VALUE_STORE_BUCKET_SATELLITE_METADATA = 'satellite-metadata'
export const OBJECT_STORE_BUCKET_WEB_FRIENDLY_IMAGES = 'web-friendly-images'

console.log(import.meta.env)
const natsURL = import.meta.env.VITE_NATS_URL
if (!natsURL) throw new Error('VITE_NATS_URL is not set')

const nc = await connect({ servers: [import.meta.env.VITE_NATS_URL] })

export async function natsClient() {
  while (!nc) {
    await new Promise((resolve) => setTimeout(resolve, 10))
  }
  return nc
}

export async function natsJetstreamClient() {
  const nc = await natsClient()
  return nc.jetstream()
}

export async function natsKVClient(bucket: string) {
  const js = await natsJetstreamClient()
  return js.views.kv(bucket)
}

export async function natsObjectStoreClient(bucket: string) {
  const js = await natsJetstreamClient()
  return js.views.os(bucket)
}

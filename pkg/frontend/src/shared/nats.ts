import { connect } from 'nats.ws'
import JSONbig from 'json-bigint'

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

const enc = new TextEncoder()
export function encodeToBuf(x: any) {
	return enc.encode(JSONbig.stringify(x))
}

const dec = new TextDecoder()
export function decodeFromBuf<T>(buf: Uint8Array) {
	const str = dec.decode(buf)
	const t: T = JSONbig.parse(str)
	return t
}
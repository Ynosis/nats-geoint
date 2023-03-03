import JSONbig from 'json-bigint'
import { KV, ObjectStore } from 'nats.ws'
import {
  createEffect,
  createResource,
  createSignal,
  For,
  onMount,
  Show,
} from 'solid-js'
import {
  KEY_VALUE_STORE_BUCKET_SATELLITE_METADATA,
  natsKVClient,
  natsObjectStoreClient,
  OBJECT_STORE_BUCKET_WEB_FRIENDLY_IMAGES,
} from './nats'
import { SatelliteMetadata } from './types'

export const Metadata = () => {
  const [metadataKV, setMetadataKV] = createSignal<KV>()
  onMount(async () => {
    const kv = await natsKVClient(KEY_VALUE_STORE_BUCKET_SATELLITE_METADATA)
    setMetadataKV(kv)
  })
  const [currentFrameOffsets, setCurrentFrameOffset] = createSignal<number[]>(
    [],
  )
  const [metadatas, setMetadatas] = createSignal<SatelliteMetadata[]>([])
  createEffect(async () => {
    const kv = metadataKV()
    if (!kv) {
      console.log('no kv')
      return []
    }

    const metadatas = []
    for await (const key of await kv.keys()) {
      const entry = await kv.get(key)

      let str = ''
      for (let i = 0; i < entry.value.length; i++) {
        str += String.fromCharCode(entry.value[i])
      }
      const v: SatelliteMetadata = JSONbig.parse(str)
      metadatas.push(v)
    }
    setMetadatas(metadatas)
    while (currentFrameOffsets().length < metadatas.length) {
      setCurrentFrameOffset((currentFrameOffset) => [...currentFrameOffset, 1])
    }

    for await (const { value } of await kv.watch()) {
      let str = ''
      for (let i = 0; i < value.length; i++) {
        str += String.fromCharCode(value[i])
      }
      const v: SatelliteMetadata = JSONbig.parse(str)
      setMetadatas((metadatas) => {
        const newMetadatas = [...metadatas]
        const index = newMetadatas.findIndex(
          (m) => m.id.toString() === v.id.toString(),
        )
        if (index === -1) {
          newMetadatas.push(v)
        } else {
          newMetadatas[index] = v
        }
        return newMetadatas
      })

      while (currentFrameOffsets().length < metadatas.length) {
        setCurrentFrameOffset((currentFrameOffset) => [
          ...currentFrameOffset,
          1,
        ])
      }
    }
  })

  const [imageStore, setImageStore] = createSignal<ObjectStore>()
  onMount(async () => {
    const store = await natsObjectStoreClient(
      OBJECT_STORE_BUCKET_WEB_FRIENDLY_IMAGES,
    )
    setImageStore(store)
  })

  const [currentThumbnailURLs] = createResource(
    currentFrameOffsets,
    async () => {
      const webImageStore = imageStore()
      if (!webImageStore) return []

      const offsets = currentFrameOffsets()
      const mm = metadatas()
      if (!mm) return []

      return await Promise.all(
        mm.map(async (metadata, i) => {
          const frameOffset = offsets[i]
          if (!frameOffset) return
          const path = `${metadata.id}_${frameOffset
            .toString()
            .padStart(5, '0')}_thumbnail`
          console.log(path)
          const res = await webImageStore.get(path)
          if (!res?.data) {
            console.error(`no data for ${path}`)
            return
          }

          const streamRes = await res.data.getReader().read()
          const blob = new Blob([streamRes.value], { type: 'image/jpeg' })
          const url = URL.createObjectURL(blob)
          return url
        }),
      )
    },
  )

  const buttonFrameOffsets = () =>
    metadatas().map((metadata, i) => {
      const frameOffset = currentFrameOffsets()[i]
      if (!frameOffset) return

      const count = 3
      const offsets: number[] = []
      for (let i = frameOffset - count; i <= frameOffset + count; i++) {
        if (i < 1) continue
        if (i > metadata.lastFrameProcessed) continue

        offsets.push(i)
      }
      return offsets
    })

  const [fullSizeImageFrames, setFullSizeImageFrames] = createSignal<number[]>(
    [],
  )
  const [fullSizeImageData] = createResource(fullSizeImageFrames, async () => {
    const webImageStore = imageStore()
    if (!webImageStore) return []

    const mm = metadatas()
    if (!mm) return []

    return await Promise.all(
      fullSizeImageFrames().map(async (frameOffset, i) => {
        const metadata = mm[i]
        const path = `${metadata.id}_${frameOffset
          .toString()
          .padStart(5, '0')}_full`
        console.log(path)
        const res = await webImageStore.get(path)
        if (!res?.data) {
          console.error(`no data for ${path}`)
          return
        }

        const streamRes = await res.data.getReader().read()
        const blob = new Blob([streamRes.value], { type: 'image/jpeg' })
        const url = URL.createObjectURL(blob)
        return url
      }),
    )
  })

  return (
    <Show when={metadataKV()} fallback={<div>No NATs connection</div>}>
      <div>Connected to NATs</div>
      <div class="">
        <For each={metadatas()} fallback={<div>No metadata</div>}>
          {(metadata, i) => (
            <div class="card bg-base-200">
              <div class="card-body flex flex-col flex-wrap">
                <div class="flex gap-4 flex-wrap">
                  <div class="form-control">
                    <label class="label">ID</label>
                    <input
                      class="input input-bordered"
                      readOnly
                      value={metadata.id.toString()}
                    />
                  </div>
                  <div class="form-control">
                    <label class="label">Frame Count</label>
                    <input
                      class="input input-bordered"
                      readOnly
                      value={metadata.frameCount}
                    />
                  </div>
                  <div class="form-control">
                    <label class="label">Original Resolution</label>
                    <input
                      class="input input-bordered"
                      readOnly
                      value={`${metadata.orginalResolutionWidth}x${metadata.orginalResolutionHeight}`}
                    />
                  </div>
                </div>
                <div class="form-control">
                  <label class="label">Original Feed</label>
                  <input
                    class="input input-bordered"
                    readOnly
                    value={metadata.initialSourceURL}
                  />
                </div>
                <div class="flex flex-col items-center gap-2">
                  <img
                    class="rounded-xl object-contain"
                    src={currentThumbnailURLs()[i()]}
                  />

                  <div class="flex gap-2">
                    <For each={buttonFrameOffsets()[i()]}>
                      {(frameOffset) => (
                        <button
                          class={`btn ${
                            frameOffset === currentFrameOffsets()[i()]
                              ? 'btn-primary'
                              : 'btn-ghost'
                          }`}
                          onClick={() => {
                            const offsets = [...currentFrameOffsets()]
                            offsets[i()] = frameOffset
                            setCurrentFrameOffset(offsets)
                          }}
                        >
                          {frameOffset}
                        </button>
                      )}
                    </For>
                  </div>
                  {fullSizeImageFrames()}
                  <button
                    class="btn btn-secondary w-full btn-ghost"
                    onClick={() => {
                      const frames = [...fullSizeImageFrames()]
                      frames[i()] = currentFrameOffsets()[i()]
                      setFullSizeImageFrames(frames)
                    }}
                  >
                    Show full size
                  </button>
                  <Show when={fullSizeImageData()}>
                    <img
                      class="rounded-xl object-contain"
                      src={fullSizeImageData()[i()]}
                    />
                  </Show>
                </div>

                <Show
                  when={metadata.lastFrameProcessed !== metadata.frameCount}
                  fallback={<div>All processing done</div>}
                >
                  <div>
                    {metadata.lastFrameProcessed} / {metadata.frameCount}
                  </div>
                  <progress
                    class="progress progress-primary w-full"
                    value={metadata.lastFrameProcessed}
                    max={metadata.frameCount}
                  />
                </Show>
              </div>
            </div>
          )}
        </For>
      </div>
    </Show>
  )
}

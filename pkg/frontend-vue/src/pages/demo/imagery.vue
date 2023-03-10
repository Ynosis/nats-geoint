<script setup lang="ts">
  import { bytesHumanize } from '@/shared/convert'
  import {
    decodeFromBuf,
    encodeToBuf,
    natsKVClient,
    natsObjectStoreClient,
  } from '@/shared/nats'
  import VueMermaidString from 'vue-mermaid-string'

  const [metadataKV, webImageStore] = await Promise.all([
    natsKVClient('satellite-metadata'),
    natsObjectStoreClient('web-friendly-images'),
  ])

  const webStoreImage = async (
    m: SatelliteMetadata,
    frame: number,
    suffix: string,
  ) => {
    const path = `${m.id}_${frame.toString().padStart(5, '0')}_${suffix}`
    console.log(path)
    const res = await webImageStore.get(path)
    if (!res?.data) {
      console.error(`no data for ${path}`)
      return
    }

    const r = await res.data.getReader()
    const blobParts: Uint8Array[] = []
    while (true) {
      const { done, value } = await r.read()
      if (done) {
        break
      }
      if (value && value.length) {
        blobParts.push(value)
      }
    }
    const blob = new Blob(blobParts, { type: 'image/jpeg' })
    const url = URL.createObjectURL(blob)
    return url
  }

  interface SatelliteMetadata {
    id: number
    initialSourceURL: string
    shouldBeProcessed: boolean
    pullFromFeed: {
      wasCached: boolean
      bytes: number
    }
    hiRez: {
      orginalResolutionWidth: number
      orginalResolutionHeight: number
      frameCount: number
      lastFrameProcessed: number
    }
    webFriendly: {
      width: number
      height: number
      thumbnailWidth: number
      thumbnailHeight: number
      frameCount: number
      lastFrameProcessed: number
    }
  }

  const metadatas = ref<SatelliteMetadata[]>([])
  const currentFrames = ref<
    { thumbnail: number; left: number; right: number }[]
  >([])
  const thumbnailButtonFrames = computed(() => {
    return metadatas.value.map((metadata, i) => {
      const frameOffset = currentFrames.value[i].thumbnail
      if (!frameOffset) return

      const count = 3
      const offsets: number[] = []
      for (let i = frameOffset - count; i <= frameOffset + count; i++) {
        if (i < 1) continue
        if (i > metadata.webFriendly.lastFrameProcessed) continue

        offsets.push(i)
      }
      return offsets
    })
  })
  const thumbnailImageURLs = computedAsync(async () => {
    const frames = currentFrames.value
    if (!frames.length) return []

    const dataURLs = frames.map(async (frame, i) => {
      if (!frame || !webImageStore) return

      const metadata = metadatas.value[i]
      const url = await webStoreImage(metadata, frame.thumbnail, 'thumbnail')
      return url
    })

    return await Promise.all(dataURLs)
  }, [])

  const setLeftFrame = (i: number) => {
    currentFrames.value[i].left = currentFrames.value[i].thumbnail
  }
  const setRightFrame = (i: number) => {
    currentFrames.value[i].right = currentFrames.value[i].thumbnail
  }

  const compareImageURLs = computedAsync(async () => {
    const frames = currentFrames.value
    if (!frames.length) return []

    const dataURLs = frames.map(async (frame, i) => {
      if (!frame || !webImageStore) return { leftURL: '', rightURL: '' }

      const metadata = metadatas.value[i]
      const [leftURL, rightURL] = await Promise.all([
        webStoreImage(metadata, frame.left, 'full'),
        webStoreImage(metadata, frame.right, 'full'),
      ])
      return { leftURL, rightURL }
    })

    return await Promise.all(dataURLs)
  }, [])

  watchEffect(async () => {
    for await (const e of await metadataKV.watch()) {
      const m: SatelliteMetadata = decodeFromBuf(e.value)
      const id = m.id.toString()
      let i = metadatas.value.findIndex(x => x.id.toString() === id)
      if (i === -1) {
        metadatas.value.push(m)
        currentFrames.value.push({
          thumbnail: 1,
          left: 1,
          right: 1,
        })
        i = metadatas.value.length - 1
      } else {
        metadatas.value[i] = m
      }

      metadatas.value.sort((a, b) => {
        if (a.shouldBeProcessed && !b.shouldBeProcessed) return -1
        if (!a.shouldBeProcessed && b.shouldBeProcessed) return 1
        return a.initialSourceURL.localeCompare(b.initialSourceURL)
      })
    }
  })

  function startProcess(m: SatelliteMetadata) {
    m.shouldBeProcessed = true
    metadataKV.put(m.id.toString(), encodeToBuf(m))
    console.log('startProcess', m)
  }

  function removeProcess(m: SatelliteMetadata) {
    m.shouldBeProcessed = false
    metadataKV.put(m.id.toString(), encodeToBuf(m))
    console.log('removeProcess', m)
  }

  const doneArrow = '--o'
  const pendingArrow = '-. pending .->'
  const content = computed(() => {
    return metadatas.value.map(
      m => `
      flowchart LR
          Started["Process started"]
          FromFeed["<i>Pull from feed</i>
      ${m.pullFromFeed.wasCached ? 'Cached' : 'Downloaded'}
      ${bytesHumanize(m.pullFromFeed.bytes)}"]
          HiRez["<i>Convert to High Resolution</i>
      ${m.hiRez.orginalResolutionWidth}x${m.hiRez.orginalResolutionHeight}
      ${m.hiRez.lastFrameProcessed}/${m.hiRez.frameCount} processed"]
          WebFriendly["<i>Make Web Friendly</i>
      Full: ${m.webFriendly.width}x${m.webFriendly.height}
      Thumbnail: ${m.webFriendly.thumbnailWidth}x${
        m.webFriendly.thumbnailHeight
      }
      ${m.webFriendly.lastFrameProcessed}/${m.webFriendly.frameCount} processed
      "]
          %% ML[Machine Learning]

          Started${m.shouldBeProcessed ? doneArrow : pendingArrow}FromFeed
          FromFeed${
            m.hiRez.frameCount &&
            m.hiRez.lastFrameProcessed === m.hiRez.frameCount
              ? doneArrow
              : pendingArrow
          }HiRez
          HiRez${
            m.webFriendly.lastFrameProcessed === m.webFriendly.frameCount
              ? doneArrow
              : pendingArrow
          }WebFriendly
          %% HiRez-. done .->ML
          %% ML-. pending .->WebFriendly

      `,
    )
  })
</script>

<template>
  <Suspense>
    <template #fallback>
      <div>Waiting for NATS server</div>
    </template>
    <template #default>
      <div>
        <div class="text-xl uppercase text-bold">Imagery from timelapse</div>
        <div>
          <div
            class="shadow-lg card bg-base-100"
            v-for="(m, i) in metadatas"
            :key="m.id.toString()"
          >
            <div class="card-body">
              <div class="flex flex-wrap justify-between">
                <div>
                  <div class="card-title">
                    <span class="opacity-50">ID:</span>
                    {{ m.id }}
                  </div>
                  <div class="card-compact">
                    <span class="opacity-50">SOURCE:</span>
                    {{ m.initialSourceURL }}
                  </div>
                </div>
              </div>
              <div class="grid w-full place-items-center">
                <VueMermaidString
                  :value="content[i]"
                  :options="{ theme: 'dark' }"
                />
              </div>
              <div class="divider" />
              <div class="flex flex-col items-center gap-2">
                <div class="flex items-end gap-4">
                  <button
                    class="btn btn-primary btn-xl"
                    @click="setLeftFrame(i)"
                  >
                    <icon-mdi:arrow-down-left /> Set Left
                    {{ currentFrames[i].left }}
                  </button>
                  <img
                    class="object-contain shadow-2xl rounded-xl ring-2 ring-primary"
                    :src="thumbnailImageURLs[i]"
                  />
                  <button
                    class="btn btn-primary btn-xl"
                    @click="setRightFrame(i)"
                  >
                    <icon-mdi:arrow-down-right /> Set Right
                    {{ currentFrames[i].right }}
                  </button>
                </div>
                <div class="flex gap-2">
                  <div v-for="tf in thumbnailButtonFrames[i]">
                    <button
                      class="btn"
                      :class="{
                        'btn-primary': tf === currentFrames[i].thumbnail,
                        'btn-ghost': tf !== currentFrames[i].thumbnail,
                      }"
                      @click="currentFrames[i].thumbnail = tf"
                    >
                      {{ tf }}
                    </button>
                  </div>
                </div>
              </div>
              <div class="rounded-xl">
                <image-compare
                  :full="false"
                  :padding="{ left: 20, right: 20 }"
                  :after="compareImageURLs[i].leftURL"
                  :before="compareImageURLs[i].rightURL"
                />
              </div>
              <div class="divider" />
              <div class="justify-end card-actions">
                <button
                  v-if="m.shouldBeProcessed"
                  class="btn btn-error btn-xs"
                  @click="removeProcess(m)"
                >
                  <icon-mdi:delete />
                  Remove processed
                </button>
                <button v-else class="btn btn-success" @click="startProcess(m)">
                  <icon-mdi:check />
                  Start Process
                </button>
              </div>
            </div>
          </div>
        </div>

        {{ metadatas }}
      </div>
    </template>
  </Suspense>
</template>

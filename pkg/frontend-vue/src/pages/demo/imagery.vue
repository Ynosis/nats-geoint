<script setup lang="ts">
  import { bytesHumanize } from '@/shared/convert'
  import {
    decodeFromBuf,
    encodeToBuf,
    natsClient,
    natsKVClient,
    natsObjectStoreClient,
  } from '@/shared/nats'

  const [nc, metadataKV, webImageStore] = await Promise.all([
    natsClient(),
    natsKVClient('satellite-metadata'),
    natsObjectStoreClient('web-friendly-images'),
  ])

  const webStoreImage = async (
    m: SatelliteMetadata,
    frame: number,
    suffix: string,
  ) => {
    const path = `${m.id}_${frame.toString().padStart(5, '0')}_${suffix}`
    // console.log(`getting ${path} from web store`)
    const res = await webImageStore.get(path)
    if (!res?.data) {
      // console.error(`no data for ${path}`)
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

    const blob = new Blob(blobParts, { type: 'image/jpg' })
    const url = URL.createObjectURL(blob)
    return url
  }

  interface SatelliteMetadata {
    id: bigint
    initialSourceURL: string
    shouldBeProcessed: boolean
    pullFromFeed: {
      wasCached: boolean
      bytes: number
    }
    hiRez: {
      orginalResolutionWidth: number
      orginalResolutionHeight: number
      conversionProgress: string
      frameCount: number
      lastFrameUploaded: number
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
  interface SatelliteMetadataRevision {
    metadata: SatelliteMetadata
    revision: number
  }

  const metadataRevisions = ref<SatelliteMetadataRevision[]>([])
  const currentFrames = ref<
    { thumbnail: number; left: number; right: number }[]
  >([])

  const thumbnailButtonFrames = computed(() => {
    return metadataRevisions.value.map((metadataRevision, i) => {
      const frameOffset = currentFrames.value[i].thumbnail
      if (!frameOffset) return

      const count = 5
      const offsets: number[] = []
      for (let i = frameOffset - count; i <= frameOffset + count; i++) {
        if (i < 1) continue
        if (i > metadataRevision.metadata.webFriendly.lastFrameProcessed)
          continue

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

      const metadataRevision = metadataRevisions.value[i]
      const url = await webStoreImage(
        metadataRevision.metadata,
        frame.thumbnail,
        'thumbnail',
      )
      return url
    })

    return await Promise.all(dataURLs)
  }, [])

  const setLeftFrame = (i: number) => {
    const currentFrame = currentFrames.value[i]
    currentFrame.left = currentFrame.thumbnail

    const videoFeedID = metadataRevisions.value[i].metadata.id
    updateDiff(videoFeedID, currentFrame.left, currentFrame.right)
  }

  const setRightFrame = (i: number) => {
    const currentFrame = currentFrames.value[i]
    currentFrame.right = currentFrame.thumbnail

    const videoFeedID = metadataRevisions.value[i].metadata.id
    updateDiff(videoFeedID, currentFrame.left, currentFrame.right)
  }

  interface SatelliteImageryDiffSuccessResponse {
    averageDistance: number
    differenceDistance: number
    perceptionDistance: number
  }

  interface SatelliteImageryDiffResponse {
    error: string
    success: SatelliteImageryDiffSuccessResponse
  }

  const diffStats = ref<SatelliteImageryDiffSuccessResponse[]>([])
  const updateDiff = async (
    videoFeedID: BigInt,
    startFrame: number,
    endFrame: number,
  ) => {
    const i = metadataRevisions.value.findIndex(
      x => x.metadata.id === videoFeedID,
    )
    if (i === -1) return

    diffStats.value[i] = {
      averageDistance: 0,
      differenceDistance: 0,
      perceptionDistance: 0,
    }

    const encoded = encodeToBuf({ videoFeedID, startFrame, endFrame })
    const msg = await nc.request('satellite-imagery-diff', encoded, {
      timeout: 10 * 1000,
    })
    const res = decodeFromBuf<SatelliteImageryDiffResponse>(msg.data)

    if (res.error) {
      console.error(res.error)
    }

    diffStats.value[i] = res.success
  }

  const compareImageURLs = computedAsync(async () => {
    const frames = currentFrames.value
    if (!frames.length) return []

    const dataURLs = frames.map(async (frame, i) => {
      if (!frame || !webImageStore) return { leftURL: '', rightURL: '' }

      const { metadata } = metadataRevisions.value[i]
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
      const { value, revision } = e
      const metadata: SatelliteMetadata = decodeFromBuf(value)
      const id = metadata.id.toString()
      let i = metadataRevisions.value.findIndex(
        x => x.metadata.id.toString() === id,
      )
      if (i === -1) {
        metadataRevisions.value.push({ metadata, revision })
        currentFrames.value.push({
          thumbnail: 1,
          left: 1,
          right: 1,
        })
        diffStats.value.push({
          averageDistance: 0,
          differenceDistance: 0,
          perceptionDistance: 0,
        })
        i = metadataRevisions.value.length - 1
      } else {
        metadataRevisions.value[i] = { metadata, revision }
      }
    }
  })

  async function startProcess(mr: SatelliteMetadataRevision) {
    mr.metadata.shouldBeProcessed = true
    await metadataKV.update(
      mr.metadata.id.toString(),
      encodeToBuf(mr.metadata),
      mr.revision,
    )
  }

  async function loadMetadata() {
    await nc.publish('satellites.metadata.pull')
  }
</script>

<template>
  <Suspense>
    <template #fallback>
      <div>Waiting for NATS server</div>
    </template>
    <template #default>
      <div class="h-full">
        <div
          v-if="!!!metadataRevisions.length"
          class="grid w-full h-full place-items-center"
        >
          <button class="btn btn-primary btn-xl" @click="loadMetadata">
            Load metadata from source
          </button>
        </div>
        <div v-else class="flex flex-col gap-4">
          <div class="text-2xl text-center uppercase text-bold">
            Imagery from timelapses
          </div>
          <div class="flex flex-col items-center gap-4">
            <div
              class="w-full max-w-6xl shadow-lg card bg-base-100"
              v-for="(mr, i) in metadataRevisions"
              :key="mr.metadata.id.toString()"
            >
              <div class="card-body">
                <div class="flex flex-wrap justify-between">
                  <div>
                    <div class="uppercase card-title">
                      {{
                        mr.metadata.initialSourceURL
                          .split('/')
                          .slice(-1)[0]
                          .split('.')[0]
                          .replaceAll('-', ' ')
                      }}
                    </div>
                    <div class="opacity-50 card-compact">
                      ID: {{ mr.metadata.id }}
                    </div>
                    <div class="opacity-50 card-compact">
                      SOURCE: {{ mr.metadata.initialSourceURL }}
                    </div>
                  </div>
                </div>
                <div
                  class="grid w-full place-items-center"
                  v-if="
                    mr.metadata.shouldBeProcessed &&
                    (!mr.metadata.webFriendly.frameCount ||
                      mr.metadata.webFriendly.lastFrameProcessed !==
                        mr.metadata.webFriendly.frameCount)
                  "
                >
                  <!-- <VueMermaidString
                  :value="content[i]"
                  :options="{ theme: 'dark' }"
                /> -->
                  <ul class="items-start w-full steps">
                    <li
                      data-content="📡"
                      class="step"
                      :class="{
                        'step-primary': mr.metadata.pullFromFeed.bytes,
                      }"
                    >
                      <div class="font-bold">Pull from feed</div>
                      <div>
                        {{
                          mr.metadata.pullFromFeed.wasCached
                            ? 'Cached'
                            : 'Downloaded'
                        }}
                      </div>
                      <div v-if="mr.metadata.pullFromFeed.bytes">
                        {{ bytesHumanize(mr.metadata.pullFromFeed.bytes) }}
                      </div>
                    </li>
                    <li
                      data-content="🎥"
                      class="step"
                      :class="{
                        'step-primary':
                          mr.metadata.hiRez.conversionProgress === 'done',
                      }"
                    >
                      <div class="font-bold">Convert to Images</div>
                      <div>
                        {{ mr.metadata.hiRez.orginalResolutionWidth }}x{{
                          mr.metadata.hiRez.orginalResolutionHeight
                        }}
                      </div>
                      <div
                        v-if="
                          mr.metadata.hiRez.conversionProgress.endsWith('%')
                        "
                        class="radial-progress"
                        :style="`--value: ${mr.metadata.hiRez.conversionProgress.replaceAll(
                          '%',
                          '',
                        )};`"
                      >
                        {{ mr.metadata.hiRez.conversionProgress }}
                      </div>
                    </li>
                    <li
                      data-content="⬆️"
                      class="step"
                      :class="{
                        'step-primary':
                          mr.metadata.hiRez.frameCount &&
                          mr.metadata.hiRez.lastFrameUploaded ===
                            mr.metadata.hiRez.frameCount,
                      }"
                    >
                      <div class="font-bold">Upload High Resolution</div>
                      <div
                        v-if="
                          mr.metadata.hiRez.lastFrameUploaded !==
                          mr.metadata.hiRez.frameCount
                        "
                        class="radial-progress"
                        :style="`--value: ${Math.round(
                          (100 * mr.metadata.hiRez.lastFrameUploaded) /
                            mr.metadata.hiRez.frameCount,
                        )};`"
                      >
                        {{
                          Math.round(
                            (100 * mr.metadata.hiRez.lastFrameUploaded) /
                              mr.metadata.hiRez.frameCount,
                          )
                        }}%
                      </div>
                      <div v-else>
                        {{ mr.metadata.hiRez.frameCount }} frames
                      </div>
                    </li>
                    <li
                      data-content="🖼️"
                      class="step"
                      :class="{
                        'step-primary':
                          mr.metadata.webFriendly.frameCount &&
                          mr.metadata.webFriendly.lastFrameProcessed ===
                            mr.metadata.webFriendly.frameCount,
                      }"
                    >
                      <div class="font-bold">Convert to Web</div>
                      <div
                        v-if="
                          mr.metadata.webFriendly.lastFrameProcessed !==
                          mr.metadata.webFriendly.frameCount
                        "
                        class="radial-progress"
                        :style="`--value: ${Math.round(
                          (100 * mr.metadata.webFriendly.lastFrameProcessed) /
                            mr.metadata.webFriendly.frameCount,
                        )};`"
                      >
                        {{
                          Math.round(
                            (100 * mr.metadata.webFriendly.lastFrameProcessed) /
                              mr.metadata.webFriendly.frameCount,
                          )
                        }}%
                      </div>
                      <div v-else>
                        <div>
                          Full: {{ mr.metadata.webFriendly.width }}x{{
                            mr.metadata.webFriendly.height
                          }}
                        </div>
                        <div>
                          Thumbnails:
                          {{ mr.metadata.webFriendly.thumbnailWidth }}x{{
                            mr.metadata.webFriendly.thumbnailHeight
                          }}
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>

                <div
                  v-if="
                    mr.metadata.shouldBeProcessed &&
                    mr.metadata.webFriendly.frameCount
                  "
                  class="flex flex-col items-center gap-4"
                >
                  <div class="divider">Compare</div>
                  <div class="flex flex-col items-center gap-2">
                    <div class="flex flex-wrap items-end gap-4">
                      <button
                        class="btn btn-primary btn-xl"
                        @click="setLeftFrame(i)"
                      >
                        <icon-mdi:arrow-down-left /> Set Left
                        {{ currentFrames[i].left }}
                      </button>
                      <img
                        class="object-contain shadow-2xl select-none rounded-xl ring-2 ring-primary"
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
                    <div class="flex items-center gap-2">
                      <button
                        class="btn btn-ghost btn-sm"
                        @click="currentFrames[i].thumbnail = 1"
                      >
                        <icon-material-symbols:keyboard-double-arrow-left />
                      </button>
                      <button
                        v-for="tf in thumbnailButtonFrames[i]"
                        class="btn"
                        :class="{
                          'btn-primary': tf === currentFrames[i].thumbnail,
                          'btn-ghost': tf !== currentFrames[i].thumbnail,
                        }"
                        @click="currentFrames[i].thumbnail = tf"
                      >
                        {{ tf }}
                      </button>
                      <button
                        class="btn btn-ghost btn-sm"
                        @click="
                          currentFrames[i].thumbnail =
                            mr.metadata.webFriendly.lastFrameProcessed
                        "
                      >
                        <icon-material-symbols:keyboard-double-arrow-right />
                      </button>
                    </div>
                  </div>
                  <div
                    class="w-full rounded-6xl"
                    v-if="
                      compareImageURLs[i]?.leftURL &&
                      compareImageURLs[i]?.rightURL
                    "
                  >
                    <image-compare
                      :full="false"
                      :after="compareImageURLs[i].leftURL"
                      :before="compareImageURLs[i].rightURL"
                    />
                  </div>
                  <div>
                    <table class="table table-compact">
                      <caption>
                        Image differencing service
                      </caption>
                      <thead>
                        <tr>
                          <th class="">Type</th>
                          <th>Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th>Average</th>
                          <td
                            class="text-xl font-bold"
                            :class="{
                              'text-error': diffStats[i].averageDistance > 5,
                            }"
                          >
                            {{ diffStats[i].averageDistance || '-' }}
                          </td>
                        </tr>
                        <tr>
                          <th>Difference</th>
                          <td
                            class="text-xl font-bold"
                            :class="{
                              'text-error': diffStats[i].differenceDistance > 5,
                            }"
                          >
                            {{ diffStats[i].differenceDistance || '-' }}
                          </td>
                        </tr>
                        <tr>
                          <th>Perception</th>
                          <td
                            class="text-xl font-bold"
                            :class="{
                              'text-error': diffStats[i].perceptionDistance > 5,
                            }"
                          >
                            {{ diffStats[i].perceptionDistance || '-' }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="divider" />
                </div>
                <div class="justify-end card-actions">
                  <button
                    v-if="!mr.metadata.shouldBeProcessed"
                    class="btn btn-success btn-block btn-xl"
                    @click="startProcess(mr)"
                  >
                    <icon-mdi:check />
                    Start Process
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Suspense>
</template>

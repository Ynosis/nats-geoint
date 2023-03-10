<script setup lang="ts">
  import { bytesHumanize } from '@/shared/convert'
  import { decodeFromBuf, encodeToBuf, natsKVClient } from '@/shared/nats'
  import VueMermaidString from 'vue-mermaid-string'

  const KEY_VALUE_STORE_BUCKET_SATELLITE_METADATA = 'satellite-metadata'
  const OBJECT_STORE_BUCKET_WEB_FRIENDLY_IMAGES = 'web-friendly-images'

  const metadataKV = asyncComputed(async () => {
    const kv = await natsKVClient(KEY_VALUE_STORE_BUCKET_SATELLITE_METADATA)
    return kv
  })

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
      frameCount: number
      lastFrameProcessed: number
    }
    webFriendly: {
      width: number
      height: number
      frameCount: number
      lastFrameProcessed: number
    }
  }

  const metadatas = ref<SatelliteMetadata[]>([])

  watchEffect(async () => {
    const w = await metadataKV.value.watch()
    for await (const e of w) {
      const m: SatelliteMetadata = decodeFromBuf(e.value)
      const id = m.id.toString()
      const i = metadatas.value.findIndex(x => x.id.toString() === id)
      if (i === -1) {
        metadatas.value.push(m)
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
    metadataKV.value.put(m.id.toString(), encodeToBuf(m))
    console.log('startProcess', m)
  }

  function removeProcess(m: SatelliteMetadata) {
    m.shouldBeProcessed = false
    metadataKV.value.put(m.id.toString(), encodeToBuf(m))
    console.log('removeProcess', m)
  }

  const content = computed(() =>
    metadatas.value.map(
      m => `
flowchart LR
    Started["Process started"]
    FromFeed["<i>Pull from feed</i>
${m.pullFromFeed.wasCached ? 'Cached' : 'Downloaded'}
${bytesHumanize(m.pullFromFeed.bytes)}"]
    HiRez["<i>Convert to High Resolution</i>
${m.hiRez.orginalResolutionWidth}x${m.hiRez.orginalResolutionHeight}
${m.hiRez.frameCount}/${m.hiRez.lastFrameProcessed} processed"]
    WebFriendly[Make Web Friendly]
    %% ML[Machine Learning]
 
    Started-.${m.shouldBeProcessed ? '' : ' pending '}.->FromFeed
    FromFeed-. pending .->HiRez
    HiRez-. pending .->WebFriendly
    %% HiRez-. done .->ML
    %% ML-. pending .->WebFriendly

`,
    ),
  )
</script>

<template>
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
          <div class="text-right">
            <div class="card-compact">
              <!--
              <span class="opacity-50">Original&nbsp;Resolution:</span>
               <span
                v-if="!m.orginalResolutionWidth || !m.orginalResolutionHeight"
                >Unknown</span
              >
              <span v-else>
                {{ m.orginalResolutionWidth }}x{{ m.orginalResolutionHeight }}
              </span> -->
            </div>
            <!-- <div class="card-compact">
              <span class="opacity-50">Frame Count:</span>
              <span>{{ m.frameCount || 'Unknown' }}</span>
            </div> -->
          </div>
        </div>
        <VueMermaidString :value="content[i]" :options="{ theme: 'dark' }" />
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
</template>

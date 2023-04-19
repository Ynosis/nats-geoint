<script setup lang="ts">
  import {
    decodeFromBuf,
    natsClient,
    natsJetstreamClient,
    natsKVClient,
  } from '@/shared/nats'
  import { useRafFn } from '@vueuse/core'
  import { consumerOpts } from 'nats.ws'
  import Feature from 'ol/Feature'
  import { Point } from 'ol/geom'
  import TileLayer from 'ol/layer/Tile'
  import VectorLayer from 'ol/layer/Vector'
  import OLMap from 'ol/Map'
  import { fromLonLat } from 'ol/proj'
  import VectorSource from 'ol/source/Vector'
  import XYZ from 'ol/source/XYZ'
  import CircleStyle from 'ol/style/Circle'
  import Fill from 'ol/style/Fill'
  import Style from 'ol/style/Style'
  import TextStyle from 'ol/style/Text'
  import View from 'ol/View'

  const mapRef = ref<HTMLDivElement>()

  const [nc, js, kvMetadata] = await Promise.all([
    natsClient(),
    natsJetstreamClient(),
    natsKVClient('SatelliteTrackingMetadata'),
  ])

  interface satelliteMetadata {
    OBJECT_ID?: string
    OBJECT_NAME?: string
    EPOCH?: string
    MEAN_MOTION?: number
    ECCENTRICITY?: number
    INCLINATION?: number
    RA_OF_ASC_NODE?: number
    ARG_OF_PERICENTER?: number
    MEAN_ANOMALY?: number
    EPHEMERIS_TYPE?: number
    CLASSIFICATION_TYPE?: string
    NORAD_CAT_ID?: number
    ELEMENT_SET_NO?: number
    REV_AT_EPOCH?: number
    BSTAR?: number
    MEAN_MOTION_DOT?: number
    MEAN_MOTION_DDOT?: number
  }

  const metadatas = ref(new Map<string, satelliteMetadata>())
  const sortedMetadata = ref<satelliteMetadata[]>([])

  watchDebounced(
    metadatas,
    () => {
      const values = [...metadatas.value.values()]
      values.sort((a, b) => {
        if (a.OBJECT_NAME && !b.OBJECT_NAME) {
          return -1
        } else if (!a.OBJECT_NAME && b.OBJECT_NAME) {
          return 1
        } else if (a.OBJECT_NAME && b.OBJECT_NAME) {
          return a.OBJECT_NAME.localeCompare(b.OBJECT_NAME)
        }
        return 0
      })
      sortedMetadata.value = values
    },
    { debounce: 500, maxWait: 1000 },
  )

  const style = new Style({
    image: new CircleStyle({
      radius: 15,
      fill: new Fill({ color: '#444' }),
    }),
    text: new TextStyle({
      overflow: true,
      fill: new Fill({ color: 'white' }),
    }),
  })

  const positions = ref(new Map<string, position>())
  const objectNameToId = new Map<string, string>()

  const sortedPositions = computed(() => {
    const zero = { longitudeDeg: 0, latitudeDeg: 0, altitudeKm: 0 }
    return sortedMetadata.value.map(metadata => {
      if (!metadata.OBJECT_NAME) return zero
      const id = objectNameToId.get(metadata.OBJECT_NAME)

      if (!id) return zero

      const pos = positions.value.get(id)
      if (!pos) return zero

      return pos
    })
  })

  const shouldDeclutter = useLocalStorage('shouldDeclutter', true)

  let map: OLMap
  onMounted(async () => {
    map = new OLMap({
      target: mapRef.value,
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'https://cartodb-basemaps-1.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png',
          }),
        }),
      ],
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    })

    const satellitesSource = new VectorSource({ features: [] })
    const vectorLayer = new VectorLayer({
      source: satellitesSource,
      style: feature => {
        style.getText().setText(feature.get('name'))
        return style
      },
      declutter: shouldDeclutter.value,
    })
    map.addLayer(vectorLayer)

    watch(shouldDeclutter, () => {
      window.location.reload()
    })

    const opts = consumerOpts()
    opts.deliverLastPerSubject()
    opts.deliverTo(id)
    const sub = await js.subscribe('sat.tracking.>', opts)

    const satIndices = new Map<string, Point>()

    for await (const m of sub) {
      if (done) break
      const { subject, data } = m
      const id = subject.split('.').slice(-1)[0]

      const pos = decodeFromBuf<position>(data)

      let point = satIndices.get(id)
      if (!point) {
        point = new Point(fromLonLat([0, 0]))

        const entry = await kvMetadata.get(id)
        if (!entry) return
        const metadata = decodeFromBuf<satelliteMetadata>(entry.value)

        if (!metadata.OBJECT_NAME) return
        metadatas.value.set(subject, metadata)

        const feature = new Feature({
          name: metadata.OBJECT_NAME,
          geometry: point,
        })
        satellitesSource.addFeature(feature)
        satIndices.set(id, point)

        objectNameToId.set(metadata.OBJECT_NAME, id)
      }
      positions.value.set(id, pos)
      point.setCoordinates(fromLonLat([pos.longitudeDeg, pos.latitudeDeg]))
    }

    useRafFn(() => {
      map.render()
    })
  })

  onUnmounted(() => {
    map?.dispose()
  })

  let done = false

  function randomId(): string {
    const uint32 = window.crypto.getRandomValues(new Uint32Array(1))[0]
    return uint32.toString(16)
  }

  interface position {
    longitudeDeg: number
    latitudeDeg: number
    altitudeKm: number
  }

  const id = randomId()
  onMounted(async () => {})

  onUnmounted(() => {
    done = true
  })
</script>

<template>
  <div class="grid h-full grid-rows-2 gap-6">
    <div class="rounded-2xl">
      <div class="flex justify-end">
        <div class="form-control">
          <label class="gap-2 cursor-pointer label">
            <span class="text-right label-text">v0.0.3 Declutter</span>
            <input type="checkbox" v-model="shouldDeclutter" class="checkbox" />
          </label>
        </div>
      </div>
      <div ref="mapRef" class="h-full" />
    </div>
    <div>
      <table class="table w-full">
        <caption>
          Satellites
          {{
            sortedMetadata.length
          }}
        </caption>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Longitude</th>
            <th>Latitude</th>
            <th>Epoch</th>
            <th>Inclination</th>
            <th>Mean Anomaly</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(m, i) in sortedMetadata">
            <td>{{ m.OBJECT_ID }}</td>
            <td>{{ m.OBJECT_NAME }}</td>
            <td>{{ sortedPositions[i].longitudeDeg.toFixed(2) }}</td>
            <td>{{ sortedPositions[i].latitudeDeg.toFixed(2) }}</td>
            <td>{{ m.EPOCH }}</td>
            <td>{{ m.INCLINATION }}</td>
            <td>{{ m.MEAN_ANOMALY }}</td>
          </tr>
        </tbody>
      </table>
      {{}}
    </div>
  </div>
</template>

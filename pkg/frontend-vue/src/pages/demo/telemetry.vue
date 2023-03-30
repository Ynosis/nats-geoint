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
    natsKVClient('SatalliteTrackingMetadata'),
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
  const sortedMetadata = computed(() => {
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
    return values
  })

  const sortedPositions = computed(() => {
    const values: position[] = []
    sortedMetadata.value.forEach(metadata => {
      const id = metadata.OBJECT_ID
      if (!id) return
      const pos = positions.value.get(id)
      if (pos) values.push(pos)
    })
    return values
  })

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
    })
    map.addLayer(vectorLayer)

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
        metadatas.value.set(subject, metadata)

        const feature = new Feature({
          name: metadata.OBJECT_NAME,
          geometry: point,
        })
        satellitesSource.addFeature(feature)
        satIndices.set(id, point)
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
      <div ref="mapRef" class="h-full" />
    </div>
    <div>
      <!-- {{ positions }} -->
      <table class="table w-full">
        <caption>
          Satellites
        </caption>
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Name</th>
            <th scope="col">Longitude</th>
            <th scope="col">Latitude</th>
            <th scope="col">Epoch</th>
            <th scope="col">Inclination</th>
            <th scope="col">Mean Anomaly</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(m, i) in sortedMetadata">
            <td>{{ m.OBJECT_ID }}</td>
            <td>{{ m.OBJECT_NAME }}</td>
            <td>X</td>
            <td>Y</td>
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

<script setup lang="ts">
  import Feature from 'ol/Feature'
  import { Point } from 'ol/geom'
  import TileLayer from 'ol/layer/Tile'
  import VectorLayer from 'ol/layer/Vector'
  import Map from 'ol/Map'
  import { fromLonLat } from 'ol/proj'
  import VectorSource from 'ol/source/Vector'
  import XYZ from 'ol/source/XYZ'
  import View from 'ol/View'

  const mapRef = ref<HTMLDivElement>()

  let map: Map
  onMounted(() => {
    map = new Map({
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

    const cities = [
      {
        name: 'Rome',
        longitude: 12.5,
        latitude: 41.9,
      },
      {
        name: 'London',
        longitude: -0.12755,
        latitude: 51.507222,
      },
      {
        name: 'Madrid',
        longitude: -3.683333,
        latitude: 40.4,
      },
      {
        name: 'Paris',
        longitude: 2.353,
        latitude: 48.8566,
      },
      {
        name: 'Berlin',
        longitude: 13.3884,
        latitude: 52.5169,
      },
      {
        name: 'New York',
        longitude: -74.006,
        latitude: 40.7128,
      },
      {
        name: 'Seattle',
        longitude: -122.3321,
        latitude: 47.6062,
      },
      {
        name: 'Las Vegas',
        longitude: -115.1398,
        latitude: 36.1699,
      },
    ]

    const cityFeatures = cities.map(
      city =>
        new Feature({
          geometry: new Point(fromLonLat([city.longitude, city.latitude])),
        }),
    )
    const vectorSource = new VectorSource({ features: cityFeatures })
    const vectorLayer = new VectorLayer({ source: vectorSource })
    map.addLayer(vectorLayer)

    const animate = () => {
      cityFeatures.forEach((cf, i) => {
        const g = cf.getGeometry()
        if (!g) throw new Error('no geometry')
        const c = cities[i]
        g.setCoordinates(
          fromLonLat([
            c.longitude + Math.random() * 1,
            c.latitude + Math.random() * 1,
          ]),
        )
      })
      map.render()
      requestAnimationFrame(animate)
    }
    animate()
  })

  onUnmounted(() => {
    map?.dispose()
  })
</script>

<template>
  <div class="">
    <div>telemetry</div>
    <div ref="mapRef" class="h-[1024px]"></div>
  </div>
</template>

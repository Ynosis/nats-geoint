<script setup lang="ts">
  import { natsClient } from '@/shared/nats'
  import { useHead } from '@vueuse/head'
  import { ServiceInfo } from 'nats.ws'
  useHead({
    title: 'Services',
  })

  const nc = await natsClient()
  const sc = nc.services.client()

  const services = ref<ServiceInfo[]>([])

  onMounted(async () => {
    const infoIter = await sc.info()
    // await iterer
    services.value = []
    for await (const service of infoIter) {
      services.value.push(service)
    }
  })

  const stats = ref<string[][]>([])

  onMounted(async () => {
    stats.value = []
  })
</script>
<template>
  <div v-for="(s, i) in services">
    <div class="card bg-base-300">
      <div class="card-body">
        <div class="uppercase align-baseline card-title">
          {{ s.name.replaceAll('-', ' ') }}
          <div class="text-sm opacity-50">{{ s.version }}</div>
          <span class="text-sm opacity-50 text-primary">{{ s.id }}</span>
        </div>
        <div class="opacity-60">{{ s.description }}</div>
        <div class="shadow stats">
          <div v-for="stat in stats" class="stat">
            <div class="stat-title">{{ stat }}</div>
            <div class="stat-value">Key</div>
            <div class="stat-desc">Value</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import logoURL from '@/assets/synadia_wt_letters.svg'
  import { useHead } from '@vueuse/head'
  useHead({
    title: 'Demo',
  })

  const router = useRouter()
  const routeName = computed(() => router.currentRoute.value.name)
  const routeStartsWith = (name: string) => routeName.value?.startsWith(name)
</script>

<template>
  <div>
    <div
      class="sticky flex items-center justify-between w-full shadow-inner bg-base-300"
    >
      <label
        for="side-drawer"
        class="btn btn-sm btn-ghost drawer-button lg:hidden"
      >
        <icon-material-symbols:more-vert />
      </label>
      <div>
        <router-link to="/" class="btn btn-ghost">
          <div class="flex items-baseline gap-1">
            <icon-noto:satellite-antenna class="text-xl" />
            <a class="text-2xl normal-case">Satellite Demo</a>
          </div>
        </router-link>
      </div>
      <div class="font-mono text-xl font-bold">#justusenats</div>
      <div>
        <img class="h-4" :src="logoURL" />
      </div>
    </div>
    <div class="drawer drawer-mobile bg-base-200">
      <input id="side-drawer" type="checkbox" class="drawer-toggle" />
      <div class="flex flex-col gap-4 p-4 drawer-content">
        <!-- Page content here -->
        <RouterView />
      </div>
      <div class="border-r shadow-inner drawer-side border-base-300">
        <label for="side-drawer" class="drawer-overlay"></label>
        <ul class="gap-2 p-4 menu w-80 bg-base-100 text-base-content">
          <!-- Sidebar content here -->
          <li>
            <router-link
              to="/demo/imagery"
              :class="{ active: routeStartsWith('demo-imagery') }"
            >
              <icon-entypo:images />
              Imagery</router-link
            >
          </li>
          <li>
            <router-link
              to="/demo/telemetry"
              :class="{ active: routeStartsWith('demo-telemetry') }"
            >
              <icon-uil:location-arrow />
              Telemetry</router-link
            >
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

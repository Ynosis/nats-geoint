<script setup lang="ts">
  import { useHead } from '@vueuse/head'

  useHead({
    title: '404. Not Found',
  })
</script>

<template>
  <div class="grid place-items-center min-h-screen">
    <h1 class="text-blue-500 font-extrabold flex flex-col text-center">
      <span class="text-7xl">404</span>
      <span class="text-5xl mt-5">Page Not Found</span>
      <router-link to="/" class="btn btn-block btn-primary mt-5">
        Go Home
      </router-link>
    </h1>
  </div>
</template>

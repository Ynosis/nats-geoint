<template>
  <div
    data-theme="synadia"
    class="scrollbar-thin scrollbar-thumb-primary scrollbar-track-secondary"
  >
    <RouterView class="min-h-screen" v-slot="{ Component }">
      <template v-if="Component">
        <Transition mode="out-in">
          <KeepAlive>
            <Suspense>
              <!-- main content -->
              <component :is="Component"></component>

              <!-- loading state -->
              <template #fallback> Loading... </template>
            </Suspense>
          </KeepAlive>
        </Transition>
      </template>
    </RouterView>
  </div>
</template>

<style>
  body {
    height: 100vh;
  }

  :root {
    --scrollbarTrack: hsla(var(--b3));
    --scrollbarThumb: hsla(var(--n));
    --scrollbarThumbHover: hsla(var(--p));
  }
  /* Scrollbar colors*/
  /* width */
  ::-webkit-scrollbar {
    width: 12px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: var(--scrollbarTrack);
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: var(--scrollbarThumb);
    border-radius: 3px;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: var(--scrollbarThumbHover);
  }
</style>

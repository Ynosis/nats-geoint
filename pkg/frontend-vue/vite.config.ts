import { defineConfig } from 'vite';
import Vue from '@vitejs/plugin-vue'
import { resolve } from 'path';
import Pages from 'vite-plugin-pages'
import Components from 'unplugin-vue-components/vite';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import { VitePWA } from 'vite-plugin-pwa';
import AutoImport from 'unplugin-auto-import/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Vue(),

    AutoImport({
      imports: [
        'vue',
        'vue/macros',
        'vue-router',
        '@vueuse/core',
      ],
      dts: true,
      dirs: [
        './src/composables',
      ],
      vueTemplate: true,
    }),

    Pages(),


    Components({
      dts: true,
      resolvers: [
        IconsResolver({
          prefix: 'icon',
        }),
      ],
    }),

    Icons({
      compiler: 'vue3',
    }),



    VitePWA(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    fs: {
      strict: true,
    },
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', '@vueuse/core', '@vueuse/head'],
  },
});

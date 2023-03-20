import '@/styles/index.css';
import { createHead } from '@vueuse/head';
import routes from 'virtual:generated-pages';
import { createApp } from 'vue';

import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';


const app = createApp(App)
const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
})
app.use(router).use(createHead())
app.mount('#app')

// console.log(routes)
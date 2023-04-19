import '@/styles/index.css';
import { createHead } from '@vueuse/head';
import routes from 'virtual:generated-pages';
import { createApp } from 'vue';

import { createRouter, createWebHashHistory } from 'vue-router';
import App from './App.vue';


const app = createApp(App)
const router = createRouter({
	history: createWebHashHistory(),
	routes,
})
app.use(router).use(createHead())
app.mount('#app')

// console.log(routes)
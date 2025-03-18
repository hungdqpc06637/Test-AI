import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'

// Import Ant Design Vue
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

// Import routes
import routes from './router'

// Create router instance
const router = createRouter({
  history: createWebHistory(),
  routes
})

// Create pinia instance
const pinia = createPinia()

// Create app instance
const app = createApp(App)

// Use plugins
app.use(router)
app.use(pinia)
app.use(Antd)

// Mount app
app.mount('#app')

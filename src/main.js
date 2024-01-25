import './assets/base.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import api from './plugins/api.js'


const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(api)

app.mount('#app')

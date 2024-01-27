import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persist'

import App from './App.vue'
import router from './router'
import api from './plugins/api.js'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
pinia.use(piniaPersist)
app.use(router)
app.use(api)

app.mount('#app')

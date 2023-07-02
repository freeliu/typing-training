import { createApp } from 'vue'
import routers from "./routers/index.js";
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
const pinia = createPinia()


const app=createApp(App)
app.use(pinia)
app.use(routers)
app.mount('#app')

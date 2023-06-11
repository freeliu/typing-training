import { createApp } from 'vue'
import routers from "./routers/index.js";
import './style.css'
import App from './App.vue'

const app=createApp(App)
app.use(routers)
app.mount('#app')

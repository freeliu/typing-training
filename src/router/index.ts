import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import LargeContent from '../views/LargeContent.vue'
import TypingTraining from '../views/TypingTraining.vue'
import SetData from '../views/SetData.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', component: LargeContent },
  { path: '/1', component: TypingTraining },
  { path: '/set', component: SetData },
  { path: '/set/:id', component: SetData }
]

export default createRouter({
  history: createWebHashHistory(),
  routes
})

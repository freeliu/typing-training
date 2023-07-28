import { createRouter, createWebHashHistory } from 'vue-router'
import LargeContent from '../views/LargeContent.vue'
import TypingTraining from '../views/TypingTraining.vue'
import AddItem from '../views/AddItem.vue'
import SetData from '../views/SetData.vue'

const routes = [
  { path: '/', component: LargeContent },
  { path: '/1', component: TypingTraining },
  { path: '/add', component: AddItem },
  { path: '/set', component: SetData }
]

export default createRouter({
  history: createWebHashHistory(),
  routes
})

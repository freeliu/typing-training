import { createRouter, createWebHashHistory } from 'vue-router'
import TypingTraining from '../views/TypingTraining.vue'
import AddItem from '../views/AddItem.vue'
import SetData from '../views/SetData.vue'


const routes = [
  { path: '/', component: TypingTraining },
  { path: '/add', component: AddItem },
  { path: '/set-data', component: SetData }
]

export default createRouter({
  history: createWebHashHistory(),
  routes
})

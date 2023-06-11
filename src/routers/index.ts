import { createRouter, createWebHashHistory } from 'vue-router'
import TypingTraining from '../views/TypingTraining.vue'
import AddItem from '../views/AddItem.vue'


const routes = [
  { path: '/', component: TypingTraining },
  { path: '/add', component: AddItem }
]

export default createRouter({
  history: createWebHashHistory(),
  routes
})

import { createRouter, createWebHistory } from 'vue-router'
import LoveTimer from '../views/LoveTimer.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'love-timer',
      component: LoveTimer
    }
  ]
})

export default router

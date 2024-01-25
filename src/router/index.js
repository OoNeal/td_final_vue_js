import { createRouter, createWebHistory } from 'vue-router'
import Home from "@/views/Home.vue";
import Activities from "@/views/Activities.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component : Home
    },
    {
      path: '/activities',
      component : Activities
    },
  ]
})

export default router

import { createRouter, createWebHistory } from 'vue-router'
import Home from "@/views/Home.vue";
import Activity from "@/views/Activities.vue";
import Project from "@/views/Project.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component : Home
    },
    {
      path: '/activities',
      component : Activity
    },
    {
      path:'/projects',
      component: Project
    },
    {
      path:''
    }
  ]
})

export default router

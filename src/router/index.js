import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/Auth.js'
import Activity from "@/views/ActivityView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:'/',
      component: Activity
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('@/views/Auth/AuthView.vue'),
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('@/views/Auth/LoginView.vue'),
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('@/views/Auth/RegisterView.vue'),
        }
      ]
    }
  ]
});

router.beforeEach(async (to) => {
  const publicPages = ['/auth/login', '/auth/register'];
  const authRequired = !publicPages.includes(to.path);
  const store = useAuthStore();

  if (authRequired && store.apiKey === null) {
    store.$patch({ returnUrl: to.path });
    return '/auth/login';
  } else if (!authRequired && store.apiKey !== null) {
    return '/';
  }
});

export default router

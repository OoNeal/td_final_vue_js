import { createRouter, createWebHistory } from 'vue-router'
import { getApiKey, setReturnUrl } from '@/stores/Auth.js'
import Activity from "@/views/Activity.vue";

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

/*router.beforeEach(async (to) => {
  const publicPages = ['/auth/login', '/auth/register'];
  const authRequired = !publicPages.includes(to.path);
  const apiKey = getApiKey();

  if (authRequired && !apiKey) {
    setReturnUrl(to.path);
    return '/auth/login';
  }

});*/

export default router

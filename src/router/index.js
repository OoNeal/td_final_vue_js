import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/Auth.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    },
    {
      path:'/',
      component: () => import('@/views/HomeView.vue'),
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
    },
    {
      path: '/reporting',
      component: () => import('@/views/ReportingView.vue'),
    },
    {
      path: '/settings',
      component: () => import('@/views/Settings/SettingsView.vue'),
      children: [
        {
          path: 'profile',
          component: () => import('@/views/Settings/ProfileView.vue'),
        },
        {
          path: 'project',
          component: () => import('@/views/Settings/ProjectView.vue'),
        },
        {
          path: 'activity',
          component: () => import('@/views/Settings/ActivityView.vue'),
        }
      ]
    }
  ]
});

router.beforeEach(async (to) => {
  if (to.path === '/settings') return '/settings/profile';
  const publicPages = ['/auth', '/auth/', '/auth/login', '/auth/register'];
  const authRequired = !publicPages.includes(to.path);
  const store = useAuthStore();

  if (authRequired && store.apiKey === null) {
    store.$patch({ returnUrl: to.path });
    return '/auth/login';
  } else if (!authRequired && store.apiKey !== null) {
    console.log('Redirecting to /');
    return '';
  }
});

export default router

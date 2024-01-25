import { createRouter, createWebHistory } from 'vue-router'
import Home from "@/views/Home.vue";
import Activities from "@/views/Activities.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/activities',
      component : Activities
    },
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

import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
} from 'vue-router';
import dashboard from '@/router/dashboard';
import auth from '@/router/auth';
import home from '@/router/home';

import { useUserSession } from '@/store/userSession';
import { checkPermission } from '@/utils';

const routes: Array<RouteRecordRaw> = [
  home,
  dashboard,
  auth,
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const userSession = useUserSession();
  if (userSession.isLoggedIn && !to.meta.requiresAuth && to.path.startsWith('/admin')) {
    await router.replace({
      name: 'home',
    });
  }
  if (to.name !== 'login' && !userSession.isLoggedIn && to.path.startsWith('/admin')) {
    next({ name: 'login' });
  }
  next();
});

router.afterEach((to, from) => {
  if (typeof to.meta.title === 'string') {
    document.title = `M&M Quartz and Surfaces | ${to.meta.title}`
      || 'M&M Quartz and Surfaces';
  }
});

export default router;

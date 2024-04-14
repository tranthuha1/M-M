import AuthLayout from '@/layouts/AuthLayout.vue';
import LoginView from '../views/pages/auth/LoginView.vue';

export default {
  path: '/auth',
  component: AuthLayout,
  redirect: '/auth/login',
  children: [
    {
      path: '/auth/login',
      name: 'login',
      component: LoginView,
      meta: { title: 'Login' },
    },
  ],
};

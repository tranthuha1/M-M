import HomeLayout from '@/layouts/HomeLayout.vue';

export default {
  path: '/',
  component: HomeLayout,
  redirect: '/home',
  children: [
    {
      path: '/home',
      name: 'home',
      component: HomeLayout,
      meta: { title: 'Login' },
    },
  ],
};

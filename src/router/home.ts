import HomeLayout from '@/layouts/HomeLayout.vue';
import Home from '@/views/pages/home/index.vue';

export default {
  path: '/',
  component: HomeLayout,
  redirect: '/home',
  children: [
    {
      path: '/home',
      name: 'home',
      component: Home,
      meta: { title: 'Home' },
    },
  ],
};

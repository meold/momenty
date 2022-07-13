import { createWebHistory, createRouter } from 'vue-router';

import MainPage from '@/views/MainPage.vue';
import CreatePage from '@/views/CreatePage.vue';

const routes = [
  {
    path: '/',
    name: 'MainPage',
    component: MainPage
  },

  {
    path: '/new',
    name: 'CreatePage',
    component: CreatePage
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;

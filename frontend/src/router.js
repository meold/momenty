import { createWebHistory, createRouter } from 'vue-router';

import MainPage from '@/views/MainPage.vue';
import CreatePage from '@/views/CreatePage.vue';
import FormkitPage from '@/views/FormkitPage.vue';

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
  },

  {
    path: '/formkit',
    name: 'FormkitPage',
    component: FormkitPage
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    // always scroll to top
    return { top: 0 }
  }
});

export default router;

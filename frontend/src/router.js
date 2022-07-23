import { createWebHistory, createRouter } from 'vue-router';
import { authGuard } from '@/useLogin.js';

import MainPage from '@/views/MainPage.vue';
import CreatePage from '@/views/CreatePage.vue';
import ProfilePage from '@/views/ProfilePage.vue';
import RegisterPage from '@/views/RegisterPage.vue';
import ViewPage from '@/views/ViewPage.vue';
import SettingsPage from '@/views/SettingsPage.vue';
import TermsPage from '@/views/TermsPage.vue';
import PrivacyPage from '@/views/PrivacyPage.vue';
import ComingSoonPage from '@/views/ComingSoonPage.vue';
import ErrorPage from '@/views/ErrorPage.vue';

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
    path: '/profile',
    name: 'ProfilePage',
    component: ProfilePage
  },

  {
    path: '/register',
    name: 'RegisterPage',
    component: RegisterPage
  },

  {
    path: '/view',
    name: 'ViewPage',
    component: ViewPage
  },

  {
    path: '/settings',
    name: 'SettingsPage',
    component: SettingsPage,
    beforeEnter: authGuard
  },

  { // FIXME: remove this
    path: '/formkit',
    name: 'FormkitPage',
    component: FormkitPage
  },

  {
    path: '/terms',
    name: 'TermsPage',
    component: TermsPage
  },

  {
    path: '/privacy',
    name: 'PrivacyPage',
    component: PrivacyPage
  },

  {
    path: '/soon',
    name: 'ComingSoonPage',
    component: ComingSoonPage
  },

  {
    path: '/:pathMatch(.*)*',
    name: 'ErrorPage',
    component: ErrorPage
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

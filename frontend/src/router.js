import { createWebHistory, createRouter } from 'vue-router';
import { authGuard, userState } from '@/useLogin.js';

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
    name: 'MyProfilePage',
    component: userState.data?.id ? ProfilePage : ErrorPage,
    props: { id: userState.data?.id },
    beforeEnter: authGuard
  },

  {
    path: '/profile/:id(\\d+)',
    name: 'ProfilePage',
    component: ProfilePage,
    props: true
  },

  {
    path: '/register',
    name: 'RegisterPage',
    component: RegisterPage,
    redirect: userState.data?.id ? '/' : undefined
  },

  {
    path: '/view/:id(\\d+)',
    name: 'ViewPage',
    component: ViewPage,
    props: true
  },

  {
    path: '/settings',
    name: 'SettingsPage',
    component: SettingsPage,
    beforeEnter: authGuard
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

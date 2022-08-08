import { createWebHistory, createRouter } from 'vue-router';
import { authGuard } from '@/useLogin.js';

import MainPage from '@/views/MainPage.vue';
import SectionPage from '@/views/SectionPage.vue';
import CreatePage from '@/views/CreatePage.vue';
import ProfilePage from '@/views/ProfilePage.vue';
import RegisterPage from '@/views/RegisterPage.vue';
import ViewPage from '@/views/ViewPage.vue';
import SettingsPage from '@/views/SettingsPage.vue';
import SearchPage from '@/views/SearchPage.vue';
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
    path: '/section/:section',
    name: 'SectionPage',
    component: SectionPage,
    props: true
  },

  {
    path: '/new',
    name: 'CreatePage',
    component: CreatePage
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
    component: RegisterPage
  },

  {
    path: '/view/:id(\\d+)',
    name: 'ViewPage',
    component: ViewPage,
    props: true
  },

  {
    path: '/search',
    name: 'SearchPage',
    component: SearchPage,
    props: true,
    beforeEnter: to => {
      // prevent search page reload
      if (to.params.search === undefined) {
        return { path: '/' };
      }
    }
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

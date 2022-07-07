import { createApp } from 'vue';
import App from './App.vue';
import ipfs from './ipfs';

import 'bootstrap';
import '@/assets/styles/main.scss';

createApp(App).use(ipfs).mount('#app');

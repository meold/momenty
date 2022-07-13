import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
// import ipfs from './ipfs';

import '@/assets/styles/main.scss';

createApp(App)
  .use(router)
  .use(createPinia())
  // .use(ipfs, { host: 'ipfs.infura.io', port: 5001 })
  .mount('#app')
;

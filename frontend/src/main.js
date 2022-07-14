import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import { plugin, defaultConfig } from '@formkit/vue';
import { generateClasses } from '@formkit/tailwindcss';
import theme from './formkit-theme.js';
// import ipfs from './ipfs';

import '@/assets/styles/main.scss';

createApp(App)
  .use(router)
  .use(createPinia())
  // .use(ipfs, { host: 'ipfs.infura.io', port: 5001 })
  .use(
    plugin,
    defaultConfig({
      config: {
        classes: generateClasses(theme)
      }
    })
  )
  .mount('#app')
;

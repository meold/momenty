import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { plugin, defaultConfig } from '@formkit/vue';
import { generateClasses } from '@formkit/tailwindcss';
import theme from './formkit-theme.js';
import { configureApi } from './useApi.js';
import { error, processError } from './notify.js';
import { useMetamask } from './useMetamask.js';

import '@/assets/styles/main.scss';

configureApi({
  prefix: import.meta.env.VITE_API_URL_PREFIX,
  onError: (err, result) => {
    error({
      text: processError(err, result)
    });
  }
});

useMetamask();

createApp(App)
  .use(router)
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

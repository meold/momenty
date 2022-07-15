import { defineStore } from 'pinia';

export const useTronlink = defineStore('tronlink', {
  state: () => ({
    isInstalled: false,
    web3: {
      connected: false,
      provider: null,
      account: null,
      balance: null
    }
  }),

  actions: {
    getProviderName() {
      if (window.tronLink) {
        return "tronlink";
      } else {
        return "unknown";
      }
    },

    getConnectionStatus() {
      let connected = false;

      if (window.tronLink) {
        connected = window.tronLink.ready;
      }
      return connected;
    }
  }
});

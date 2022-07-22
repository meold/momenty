<template>
  <div>
    <button-primary v-if="!isDapp" @click="connectTronLink">
      Install Tronlink
    </button-primary>

    <button-primary v-if="isDapp && !web3.connected" @click="connectWallet">
      Connect Wallet
    </button-primary>

    <button-primary v-if="web3.connected && !web3.account" @click="connectWeb3">
      Connect Account
    </button-primary>

    <button-primary v-if="web3.account && !user">
      <spinner /> Loading
    </button-primary>

    <button-secondary v-else class="!p-3">
      <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.8891 21V18.7778C18.8891 17.599 18.4209 16.4686 17.5874 15.6351C16.7539 14.8016 15.6234 14.3333 14.4447 14.3333H5.55577C4.37703 14.3333 3.24657 14.8016 2.41308 15.6351C1.57958 16.4686 1.11133 17.599 1.11133 18.7778V21M14.4447 5.44444C14.4447 7.89904 12.4548 9.88889 10.0002 9.88889C7.54562 9.88889 5.55577 7.89904 5.55577 5.44444C5.55577 2.98985 7.54562 1 10.0002 1C12.4548 1 14.4447 2.98985 14.4447 5.44444Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button-secondary>

    <pre v-if="hint">Hint: {{ hint }}</pre>
  </div>
</template>

<script>
import Spinner from '@/components/Spinner.vue';
import ButtonPrimary from '@/components/ButtonPrimary.vue';
import ButtonSecondary from '@/components/ButtonSecondary.vue';
import { get, post } from '@/useApi.js';

export default {
  components: {
    ButtonPrimary,
    ButtonSecondary,
    Spinner
  },

  data() {
    return {
      isDapp: false,
      hint: null,
      web3: {
        connected: false,
        provider: null,
        instance: null,
        balance: null,
        account: null
      },
      user: null
    }
  },

  mounted() {
    this.isDapp = Boolean(window.tronLink);
    this.web3.provider = this.getProviderName();
    this.web3.connected = this.getConnectionStatus();

    // window.addEventListener('message', e => {
    //   if (e.data.message && e.data.message.action == "tabReply") {
    //     console.log("tabReply event", JSON.stringify(e.data.message))
    //     if (e.data.message.data.node.chain == '_'){
    //       console.log("tronLink currently selects the main chain")
    //     }else{
    //       console.log("tronLink currently selects the side chain")
    //     }
    //   }

    // if (e.data.message && e.data.message.action == "setAccount") {
    //   console.log("setAccount event", JSON.stringify(e.data.message));
    //   console.log("current address:", e.data.message.data.address);

    //   const address = e.data.message.data.address;
    //   if (address == this.web3.account) {
    //     return;
    //   }

    //   console.log('CONNECT');

    //   this.web3.connected = false;
    //   this.connectWallet();
    // }

    //   if (e.data.message && e.data.message.action == "setNode") {
    //     console.log("setNode event", JSON.stringify(e.data.message))
    //     if (e.data.message.data.node.chain == '_'){
    //       console.log("tronLink currently selects the main chain")
    //     }else{
    //       console.log("tronLink currently selects the side chain")
    //     }
    //   }
    // });

    this.connectWallet();
  },

  methods: {
    getProviderName() {
      if (window.tronLink) {
        return 'tronlink';
      }
      return 'unknown';
    },

    getConnectionStatus() {
      let connected = false;

      if (window.tronLink) {
        connected = window.tronLink.ready;
      }
      return connected;
    },

    connectWallet() {
      if (this.web3.provider == 'tronlink') {
        this.connectTronLink();
      } else {
        this.hint = 'please make sure tronlink is installed';
      }
    },

    async connectTronLink() {
      this.hint = 'connecting...';

      if (!window.tronLink) {
        // detect chrome or firefox
        const isFirefox = typeof InstallTrigger !== 'undefined';
        const isChrome = !!window.chrome;
        if (isChrome) {
          window.open(
            'https://chrome.google.com/webstore/detail/tronlink/ibnejdfjmmkpcnlpebklmnkoeoihofec',
            '_blank'
          );
        } else if (isFirefox) {
          window.open(
            'https://addons.mozilla.org/firefox/addon/tronlink-wallet/',
            '_blank'
          );
        } else {
          this.hint = 'please use chrome or firefox browser';
        }
        return;
      }

      try {
        let res = null;
        let msg = 'please create a new wallet or restore/unlock your wallet from tronlink extension';

        setTimeout(() => {
          if (res == null) {
            this.hint = msg;
          }
        }, 1000);

        res = await window.tronLink.request({ method: 'tron_requestAccounts' });

        if (res != '') {
          if (res.code != 200) {
            msg = res.code + ', ' + res.message;
            this.hint = msg;
            return;
          }
        }

        this.web3 = { ...this.web3, connected: true };
        this.connectWeb3();

      } catch (error) {
        console.log('err', error);
        this.hint = error;
      }
    },

    async connectWeb3() {
      try {
        if (window.tronLink) {
          if (!window.tronLink.ready) {
            this.hint = 'please connect tronlink or tronlink extension first'
            return
          }
          const address = window.tronWeb.defaultAddress.base58
          const balance = await window.tronWeb.trx.getBalance(address);

          this.web3 = {
            ...this.web3,
            connected: true,
            instance: window.tronWeb,
            balance,
            account: window.tronWeb.defaultAddress.base58
          }
          this.hint = null;
          this.userLogin(this.web3.account);
        } else {
          this.hint = 'please install tronlink extension first'
        }
      } catch (error) {
        console.log('err', error)
        this.hint = error
      }
    },

    async userLogin(address) {
      const _token = window.localStorage.getItem(import.meta.env.VITE_APP_LOCALSTORAGE_KEY_NAME);
      if (_token) {
        // FIXME: get user info with protected api
        this.user = true;
        return;
      }

      const { isExist } = await get(`/user/${address}/`);
      if (!isExist) {
        alert('Register me!');
        return;
      }

      const { nonce } = await get(`/user/${address}/nonce/`);
      if (!nonce) {
        // FIXME:
        return;
      }

      const signedMessage = await this.signMessage(nonce);
      if (!signedMessage) {
        return;
      }

      const { token } = await post(`/user/${address}/`, { signedMessage });
      if (!token) {
        // FIXME:
        return;
      }

      window.localStorage.setItem(import.meta.env.VITE_APP_LOCALSTORAGE_KEY_NAME, token);
      this.user = true;
    },

    async signMessage(nonce) {
      try {
        return await this.web3.instance.trx.sign(this.web3.instance.fromUtf8(`Nonce:${nonce}`));
      } catch (error) {
        if (error == 'Confirmation declined by user') {
          alert('You must sign message to login!')
        }
      }
      return null;
    }
  }
};
</script>
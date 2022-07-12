<template>
  <h3>TronLink info</h3>

  <div v-if="!isDapp">
    <h2>Please install the wallet</h2>
    <h3>
      You are currently visiting a decrentralized website, please run it in the
      wallet application which supports Trx/Tron/TronLink
    </h3>
  </div>

  <pre v-if="hint">Hint: {{ hint }}</pre>

  <button v-if="!isDapp" type="button" @click="connectTronLink">
    Download TronLink Extension
  </button>

  <button v-if="isDapp && !web3.connected" type="button" @click="connectWallet">
    Connect Wallet
  </button>

  <button type="button" @click="connectWeb3" v-if="web3.connected && !web3.account">Connect Account</button>

  <div v-if="isDapp">
    <div>Web3:</div>
    <div>Provider: {{ web3.provider }}</div>
    <div>Is Connected: {{ web3.connected }}</div>
    <div v-if="web3.account">
      <div>Account: {{ web3.account }}</div>
      <div>Balance: {{ web3.balance }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isDapp: false,
      hint: null,

      web3: {
        connected: false,
        provider: null,
      },
    };
  },

  mounted() {
    this.isDapp = !!window.tronLink;

    this.web3.provider = this.getProviderName();
    this.web3.connected = this.getConnectionStatus();
  },

  methods: {
    connectWallet() {
      if (this.web3.provider == "tronlink") {
        this.connectTronLink();
      } else {
        this.hint = 'please make sure tronlink is installed';
      }
    },

    async connectTronLink() {
      this.hint = "connecting...";

      if (!window.tronLink) {
        // detect chrome or firefox
        const isFirefox = typeof InstallTrigger !== "undefined";
        const isChrome = !!window.chrome;
        if (isChrome) {
          window.open(
            "https://chrome.google.com/webstore/detail/tronlink/ibnejdfjmmkpcnlpebklmnkoeoihofec",
            "_blank"
          );
        } else if (isFirefox) {
          window.open(
            "https://addons.mozilla.org/firefox/addon/tronlink-wallet/",
            "_blank"
          );
        } else {
          this.hint = "please use chrome or firefox browser";
        }

        return;
      }

      try {
        let res = null;
        let msg =
          "please create a new wallet or restore/unlock your wallet from tronlink extension.";

        setTimeout(() => {
          if (res == null) {
            this.hint = msg;
          }
        }, 1000);

        res = await window.tronLink.request({ method: "tron_requestAccounts" });

        if (res != "") {
          msg = res.code + ", " + res.message;
          this.hint = msg;
          return;
        }
        
        this.web3 = { ...this.web3, connected: true };
        this.connectWeb3();

      } catch (error) {
        console.log("err", error);
        this.hint = error;
      }
    },

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
    },

    async connectWeb3() {
      try {
        if (window.tronLink) {
          if (!window.tronLink.ready) {
            this.tip = 'please connect tronlink or tronlink extension first'
            return
          }
          const address = window.tronWeb.defaultAddress.base58
          const balance = await window.tronWeb.trx.getBalance(address);
          // const contract = await tronWeb.contract().at(CONTRACT);
          // const contract_name = await contract.name().call();
          // const contract_symbol = await contract.symbol().call();
          // const mycontract_balance = await contract.methods.balanceOf(window.tronWeb.defaultAddress.base58).call();
          this.web3 = { 
            ...this.web3,
            connected: true,
            instance: window.tronWeb,
            balance,
            account: window.tronWeb.defaultAddress.base58,
          }
          this.hint = 'connect success'
        } else {
          this.hint = 'please install tronlink extension first'
        }
      } catch (error) {
        console.log("err", error)
        this.hint = error
      }
    },
  },
};
</script>
import { ref, reactive, computed } from 'vue';
import { error } from '@/notify.js';

const tronlinkState = ref(null);

const shouldInstallWallet = computed(() => tronlinkState.value == 'unsupported' || tronlinkState.value == 'not_installed');
const shouldConnect = computed(() => tronlinkState.value == 'not_connected');

const web3 = reactive({
  instance: null,
  balance: null,
  address: null
});

const isFirefox = typeof InstallTrigger !== 'undefined';
const isChrome = !!window.chrome;

const isBrowserSupported = isFirefox || isChrome;

function useTronlink() {
  if (!isChrome && !isFirefox) {
    tronlinkState.value = 'unsupported';
    return;
  }

  if (!window.tronLink) {
    tronlinkState.value = 'not_installed';
    return;
  }

  resetListeners();

  if (!window.tronLink?.ready) {
    tronlinkState.value = 'not_connected';
    return;
  }

  connectWeb3();
}

function installWallet() {
  return window.open(
    getInstallLink(),
    '_blank'
  );
}

function getInstallLink() {
  if (isChrome) {
    return 'https://chrome.google.com/webstore/detail/tronlink/ibnejdfjmmkpcnlpebklmnkoeoihofec';
  }
  if (isFirefox) {
    return 'https://addons.mozilla.org/firefox/addon/tronlink-wallet/';
  }
  return 'https://www.tronlink.org/';
}

async function connectWeb3() {
  web3.instance = window.tronWeb;
  web3.address = window.tronWeb.defaultAddress.base58;

  tronlinkState.value = window.tronLink.ready ? 'connected' : 'not_connected';

  // Not now
  // getBalance();
}

async function connectTronLink() {
  try {
    const res = await window.tronLink.request({ method: 'tron_requestAccounts' });
    if (res) {
      if (res.code == 4000) {
        error({ text: 'Tronlink popup window somewhere on your screen, may be under your browser window, please find it' });
        return;
      }

      if (res.code == 4001) {
        error({ text: 'You must confirm tronlink dialog to proceed' });
        return;
      }

      if (res.code != 200) {
        error({ text: res.code + ', ' + res.message });
        return;
      }
    } else {
      error({ text: 'Looks like your wallet is locked. Please unlock it.' });
      return;
    }

    tronlinkState.value = 'not_connected';
    await connectWeb3();
  } catch (error) {
    error({ text: error.message });
  }
}

// async function getBalance() {
//   web3.balance = await web3.instance.trx.getBalance(web3.address);
// }

function resetListeners() {
  window.removeEventListener('message', onMessage);
  window.addEventListener('message', onMessage);
}

function onMessage(e) {
  // console.log('MESSAGE', e.data?.message?.action)

  if (e.data.message && e.data.message.action == 'disconnect') {
    tronlinkState.value = 'not_connected';
    connectWeb3();
    return;
  }

  if (e.data.message && e.data.message.action == 'accountsChanged') {
    console.log("accountsChanged event", JSON.stringify(e.data.message));
    console.log("current address:", e.data.message.data.address);

    const address = e.data.message.data.address;
    if (address == web3.address) {
      return;
    }

    console.log('CONNECT');

    tronlinkState.value = 'not_connected';
    connectWeb3();
    return;
  }

  // Not now

  //   if (e.data.message && e.data.message.action == "tabReply") {
  //     console.log("tabReply event", JSON.stringify(e.data.message))
  //     if (e.data.message.data.node.chain == '_'){
  //       console.log("tronLink currently selects the main chain")
  //     }else{
  //       console.log("tronLink currently selects the side chain")
  //     }
  //   }

  //   if (e.data.message && e.data.message.action == "setNode") {
  //     console.log("setNode event", JSON.stringify(e.data.message))
  //     if (e.data.message.data.node.chain == '_'){
  //       console.log("tronLink currently selects the main chain")
  //     }else{
  //       console.log("tronLink currently selects the side chain")
  //     }
  //   }
}


export {
  useTronlink,
  installWallet,
  connectTronLink,
  getInstallLink,
  tronlinkState,
  web3,
  shouldInstallWallet,
  shouldConnect,
  isBrowserSupported
};

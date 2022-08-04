import { ref, reactive, computed } from 'vue';
import { error } from '@/notify.js';
import { ethers } from 'ethers';

const metamaskState = ref(null);

const shouldInstallWallet = computed(() => metamaskState.value == 'unsupported' || metamaskState.value == 'not_installed');
const shouldConnect = computed(() => metamaskState.value == 'not_connected');

const web3 = reactive({
  instance: null,
  balance: null,
  address: null
});

const isFirefox = typeof InstallTrigger !== 'undefined';
const isChrome = !!window.chrome;
const isEdge = /Edge/.test(navigator.userAgent);

const isBrowserSupported = isFirefox || isChrome || isEdge;

function useMetamask() {
  if (!isBrowserSupported) {
    metamaskState.value = 'unsupported';
    return;
  }

  if (typeof window.ethereum === 'undefined') {
    metamaskState.value = 'not_installed';
    return;
  }

  resetListeners();

  if (!window.ethereum.selectedAddress) {
    metamaskState.value = 'not_connected';
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
    return 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn';
  }
  if (isFirefox) {
    return 'https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/';
  }
  if (isEdge) {
    return 'https://microsoftedge.microsoft.com/addons/detail/metamask/ejbalbakoplchlghecdalmeeeajnimhm?hl=en-US';
  }
  return 'https://metamask.io';
}

function connectWeb3() {

  window.ethereum.request({ method: 'eth_accounts' }).then(a => console.log('CONNECTING', a, window.ethereum.selectedAddress));

  web3.instance = window.ethereum;
  web3.address = window.ethereum.selectedAddress;

  metamaskState.value = window.ethereum.selectedAddress ? 'connected' : 'not_connected';

  // Not now
  // getBalance();
}

async function connectMetamask() {
  console.log('CONNECT METAMASK')

  try {
    const res = await window.ethereum.request({ method: 'eth_requestAccounts' });

    if (res) {
      web3.instance = window.ethereum;
      web3.address = res[0];
      metamaskState.value = 'connected';
      return true;
    } else {
      error({ text: 'Looks like your wallet is locked. Please unlock it.' });
      return;
    }
  } catch (err) {
    console.log('CATCH', err);
    if (err.code == -32002) {
      error({ text: 'Metamask popup window somewhere on your screen, may be under your browser window, please find it' });
      return;
    }

    if (err.code == 4001) {
      error({ text: 'You must confirm metamask dialog to proceed' });
      return;
    }

    error({ text: err.code + ', ' + err.message });
  }
}

// async function getBalance() {
//   web3.balance = await xxx.getBalance(web3.address);
// }

function resetListeners() {
  if (!window.ethereum) {
    return;
  }

  window.ethereum.removeListener('accountsChanged', onAccountsChanged);
  window.ethereum.on('accountsChanged', onAccountsChanged);

  // chainChanged
}

// switch chain
// try {
//   await ethereum.request({
//     method: 'wallet_switchEthereumChain',
//     params: [{ chainId: '0xf00' }],
//   });
// } catch (switchError) {
//   // This error code indicates that the chain has not been added to MetaMask.
//   if (switchError.code === 4902) {
//     try {
//       await ethereum.request({
//         method: 'wallet_addEthereumChain',
//         params: [
//           {
//             chainId: '0xf00',
//             chainName: '...',
//             rpcUrls: ['https://...'] /* ... */,
//           },
//         ],
//       });
//     } catch (addError) {
//       // handle "add" error
//     }
//   }
//   // handle other "switch" errors
// }



function onAccountsChanged(e) {
  console.log('ACCOUNTS CHANGED', e, web3.address);
  if (e[0] == web3.address) {
    return;
  }

  metamaskState.value = 'not_connected';
  connectWeb3();
}

async function signMessage(nonce) {
  if (!web3.instance || !web3.address) {
    return;
  }

  const provider = new ethers.providers.Web3Provider(web3.instance);
  const signer = provider.getSigner();

  try {
    return await signer.signMessage(`Nonce:${nonce}`);
  } catch (err) {
    if (err.code == 4001) {
      error({
        title: 'You must sign message to login!',
        text: 'It\'s absolutely FREE.'
      });
    }
  }
  return null;
}

export {
  useMetamask,
  installWallet,
  connectMetamask,
  connectWeb3,
  getInstallLink,
  signMessage,
  metamaskState,
  web3,
  shouldInstallWallet,
  shouldConnect,
  isBrowserSupported
};

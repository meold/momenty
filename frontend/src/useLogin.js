import { reactive, watch } from 'vue';
import { get, post } from '@/useApi.js';
import { error } from '@/notify.js';

import { web3 } from '@/useTronlink.js';

const userState = reactive({
  isLogged: false,
  isRegistered: false,
  data: null
});

watch(
  () => web3.address,
  () => {
    getUserState();
  }
);
getUserState();

async function isUserRegistered() {
  if (!web3.address) {
    return false;
  }

  const { isExist } = await get(`/auth/${web3.address}/`);
  return isExist;
}

async function getToken() {
  if (!web3.address) {
    return;
  }

  const { nonce } = await get(`/auth/${web3.address}/nonce/`, null, { onError: false });
  if (!nonce) {
    // FIXME:
    return;
  }

  const signedMessage = await signMessage(nonce);
  if (!signedMessage) {
    return;
  }

  const { token } = await post(`/auth/${web3.address}/`, { signedMessage });
  if (!token) {
    // FIXME:
    return;
  }

  return token;
}

async function signMessage(nonce) {
  if (!web3.instance) {
    return;
  }
  try {
    return await web3.instance.trx.sign(web3.instance.fromUtf8(`Nonce:${nonce}`));
  } catch (err) {
    if (err == 'Confirmation declined by user') {
      error({ text: 'You must sign message to login!' });
    }
  }
  return null;
}

async function login() {
  const token = await getToken();

  if (!token) {
    return false;
  }

  window.localStorage.setItem(import.meta.env.VITE_APP_LOCALSTORAGE_KEY_NAME, token);
  userState.isLogged = true;
  userState.isRegistered = true;
  userState.data = parseJwt(token);
  return true;
}

async function getUserState() {
  const token = window.localStorage.getItem(import.meta.env.VITE_APP_LOCALSTORAGE_KEY_NAME);
  if (token) {
    userState.isLogged = true;
    userState.isRegistered = true;
    userState.data = parseJwt(token);
    return true;
  }

  userState.isRegistered = await isUserRegistered();
}

async function logout() {
  userState.isLogged = false;
  userState.data = null;
  window.localStorage.removeItem(import.meta.env.VITE_APP_LOCALSTORAGE_KEY_NAME);
}

function parseJwt (token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );

  return JSON.parse(jsonPayload);
}

function authGuard() {
  if (!userState.isLogged) {
    error({ text: 'You must be logged in!' });
  }
  return userState.isLogged;
}

export {
  login,
  logout,
  userState,
  authGuard
};

<template>

  <div v-if="userState.isLogged" class="hidden" />

  <button-primary v-else-if="shouldInstallWallet" v-bind="$attrs" @click="doInstall">
    Install Tronlink
  </button-primary>

  <button-primary v-else-if="shouldConnect" v-bind="$attrs" @click="doConnect">
    Connect Wallet
  </button-primary>

  <button-primary v-else v-bind="$attrs" @click="doLogin">
    Connect Account
  </button-primary>

  <ui-dialog :show="isOpen">
    <ui-dialog-panel>
      <ui-dialog-title>
        Attention!
      </ui-dialog-title>
      Your wallet address <strong>{{ web3.address }}</strong> is not registered yet.
      Make shure you are using proper account.
      <div class="flex justify-between mt-5">
        <button-secondary @click="isOpen = false">
          Ooops...
        </button-secondary>

        <router-link v-slot="{ navigate }" to="/register" custom>
          <button-primary @click="[closeModal() , navigate()]" @keypress.enter="navigate">
            Register me!
          </button-primary>
        </router-link>
      </div>
    </ui-dialog-panel>
  </ui-dialog>

</template>

<script setup>
import UiDialog from '@/components/ui/UiDialog.vue';
import UiDialogTitle from '@/components/ui/UiDialogTitle.vue';
import UiDialogPanel from '@/components/ui/UiDialogPanel.vue';
import ButtonPrimary from '@/components/ButtonPrimary.vue';
import ButtonSecondary from '@/components/ButtonSecondary.vue';
import { error } from '@/notify.js';
import { ref } from 'vue';

import {
  web3,
  installWallet,
  connectTronLink,
  shouldInstallWallet,
  shouldConnect,
  isBrowserSupported,
  getInstallLink
} from '@/useTronlink.js';

import {
  login,
  isUserRegistered,
  userState
} from '@/useLogin.js';

const isOpen = ref(false);

function doInstall() {
  if (isBrowserSupported) {
    const _window = installWallet();
    const timer = setInterval(() => {
      if (_window.closed) {
        clearInterval(timer);
        window.location.reload();
      }
    }, 1000);
    return;
  }

  error({ text: 'Yor browser doesn\'t support Tronlink wallet. Please use supported one.' });
  setTimeout(() => window.location = getInstallLink(), 4000);
}

async function doConnect() {
  await connectTronLink();
  if (!userState.isRegistered) {
    await isUserRegistered();
  }
  doLogin();
}

function doLogin() {
  if (userState.isRegistered) {
    login();
    return;
  }
  isOpen.value = true;
}

function closeModal() {
  isOpen.value = false;
}
</script>
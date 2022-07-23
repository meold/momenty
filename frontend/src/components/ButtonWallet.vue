<template>

  <button-secondary v-if="userState.isLogged" v-bind="$attrs" class="!p-3" @click="logout">
    <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.8891 21V18.7778C18.8891 17.599 18.4209 16.4686 17.5874 15.6351C16.7539 14.8016 15.6234 14.3333 14.4447 14.3333H5.55577C4.37703 14.3333 3.24657 14.8016 2.41308 15.6351C1.57958 16.4686 1.11133 17.599 1.11133 18.7778V21M14.4447 5.44444C14.4447 7.89904 12.4548 9.88889 10.0002 9.88889C7.54562 9.88889 5.55577 7.89904 5.55577 5.44444C5.55577 2.98985 7.54562 1 10.0002 1C12.4548 1 14.4447 2.98985 14.4447 5.44444Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </button-secondary>

  <button-primary v-else-if="shouldInstallWallet" v-bind="$attrs" @click="install">
    Install Tronlink
  </button-primary>

  <button-primary v-else-if="shouldConnect" v-bind="$attrs" @click="connectTronLink">
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
          <button-primary @click="[() => {isOpen.value = false} , navigate()]" @keypress.enter="navigate">
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
  logout,
  userState
} from '@/useLogin.js';

const isOpen = ref(false);

function install() {
  if (isBrowserSupported) {
    installWallet();
    return;
  }

  error({ text: 'Yor browser doesn\'t support Tronlink wallet. Please use supported one.' });
  setTimeout(() => window.location = getInstallLink(), 4000);
}

function doLogin() {
  if (userState.isRegistered) {
    login();
    return;
  }
  isOpen.value = true;
}
</script>
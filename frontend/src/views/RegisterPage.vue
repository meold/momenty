<template>
  <div>
    <h1 class="font-display text-2xl leading-tight mb-10">
      Registration
    </h1>

    <form-kit ref="form" v-model="data" messages-class="text-right" :actions="false" type="form" autocomplete="off" @submit="submit">
      <div class="grid grid-cols-1 gap-x-20 md:grid-cols-2">

        <form-kit-schema :schema="schema" />

      </div>
      <template #actions>
        <FormKit
          type="submit"
          label="Register"
          wrapper-class="text-right mt-5"
        />
      </template>
    </form-kit>

    <ui-dialog :show="!web3.address">
      <ui-dialog-panel>
        <ui-dialog-title>
          Attention!
        </ui-dialog-title>
        Your wallet is disconnected. You must connect your wallet to register!
        <div class="mt-5 flex justify-end">
          <button-wallet />
        </div>
      </ui-dialog-panel>
    </ui-dialog>

    <ui-dialog :show="isRegistered">
      <ui-dialog-panel>
        <ui-dialog-title>
          Congratulations!
        </ui-dialog-title>
        Your are now can create your first NFT moment!
        <div class="mt-5 flex justify-end">
          <router-link v-slot="{ navigate }" to="/new" custom>
            <button-primary @click="[closeRegistered(), navigate()]" @keypress.enter="navigate">
              Let's go!
            </button-primary>
          </router-link>
        </div>
      </ui-dialog-panel>
    </ui-dialog>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { post } from '@/useApi.js';
import { web3 } from '@/useTronlink.js';
import { setUserState } from '@/useLogin';

import UiDialog from '@/components/ui/UiDialog.vue';
import UiDialogTitle from '@/components/ui/UiDialogTitle.vue';
import UiDialogPanel from '@/components/ui/UiDialogPanel.vue';
import ButtonWallet from '@/components/ButtonWallet.vue';
import ButtonPrimary from '@/components/ButtonPrimary.vue';

const isRegistered = ref(false);
const form = ref(null);
const data = ref({
  address: web3.address
});

watch(
  () => web3.address,
  address => {
    console.log('watched')
    data.value.address = address;
  }
)

const schema = [
  {
    $formkit: 'hidden',
    name: 'address',
    validation: 'required'
  },
  // {
  //   $formkit: 'file',
  //   name: 'avatar',
  //   label: 'Avatar',
  //   classes: {
  //     label: 'text-xl font-bold mb-2',
  //     input: 'placeholder:text-sm placeholder:opacity-30 placeholder:text-black w-full',
  //     outer: 'relative row-span-2',
  //     messages: 'absolute right-0 -mt-2'
  //   },
  //   validationVisibility: 'blur'
  // },
  {
    $formkit: 'text',
    name: 'name',
    label: 'Display name',
    classes: {
      label: 'text-xl font-bold mb-2',
      input: 'placeholder:text-sm placeholder:opacity-30 placeholder:text-black w-full',
      outer: 'relative',
      messages: 'absolute right-0 -mt-2'
    },
    placeholder: 'Enter title (maximum 120 symbols)',
    validation: 'required|length:1,120',
    validationVisibility: 'blur'
  },
  {
    $formkit: 'email',
    name: 'email',
    label: 'Email',
    classes: {
      label: 'text-xl font-bold mb-2',
      input: 'placeholder:text-sm placeholder:opacity-30 placeholder:text-black w-full',
      outer: 'relative',
      messages: 'absolute right-0 -mt-2'
    },
    placeholder: 'Your Email',
    validation: 'required|email',
    validationVisibility: 'blur'
  },
  {
    $formkit: 'textarea',
    name: 'bio',
    label: 'Bio',
    classes: {
      label: 'text-xl font-bold mb-2',
      input: 'placeholder:text-sm placeholder:opacity-30 placeholder:text-black w-full',
      outer: 'relative row-span-2',
      messages: 'absolute right-0 -mt-2'
    },
    placeholder: 'Your Bio (maximum 400 symbols)',
    validation: 'length:0,400',
    validationVisibility: 'blur'
  },
  {
    $formkit: 'text',
    name: 'twitter',
    label: 'Twitter account',
    classes: {
      label: 'text-xl font-bold mb-2',
      input: 'placeholder:text-sm placeholder:opacity-30 placeholder:text-black w-full',
      outer: 'relative',
      messages: 'absolute right-0 -mt-2'
    },
    placeholder: 'https://twitter.com/...'
  },
  {
    $formkit: 'text',
    name: 'site',
    label: 'Personal website',
    classes: {
      label: 'text-xl font-bold mb-2',
      input: 'placeholder:text-sm placeholder:opacity-30 placeholder:text-black w-full',
      outer: 'relative',
      messages: 'absolute right-0 -mt-2'
    },
    placeholder: 'https://...',
    validation: 'url',
    validationVisibility: 'blur'
  }
];

async function submit(user) {
  const { success, token } = await post('/user/', { user });
  isRegistered.value = success;
  setUserState(token);
}

function closeRegistered() {
  isRegistered.value = false;
}
</script>
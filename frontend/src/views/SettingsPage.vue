<template>
  <div>
    <h1 class="font-display text-2xl leading-tight mb-10">
      Edit Profile
    </h1>

    <form-kit ref="form" v-model="data" messages-class="text-right" :actions="false" type="form" autocomplete="off" @submit="submit">
      <div class="grid grid-cols-1 gap-x-20 md:grid-cols-2">

        <div class="row-span-2">
          <div class="formkit-div block font-bold text-xl mb-7">Avatar</div>
          <div class="flex justify-center">
            <avatar-uploader v-model:url="data.avatarUrl" />
          </div>
        </div>

        <form-kit-schema :schema="schema" />

      </div>
      <template #actions>
        <FormKit
          type="submit"
          label="Save"
          wrapper-class="text-right"
        />
      </template>
    </form-kit>

    <ui-dialog :show="!userState.isLogged">
      <ui-dialog-panel>
        <ui-dialog-title>
          Attention!
        </ui-dialog-title>
        Your wallet is disconnected. You must connect your wallet to proceed!
        <div class="mt-5 flex justify-end">
          <button-wallet />
        </div>
      </ui-dialog-panel>
    </ui-dialog>
  </div>
</template>

<script setup>
import UiDialog from '@/components/ui/UiDialog.vue';
import UiDialogTitle from '@/components/ui/UiDialogTitle.vue';
import UiDialogPanel from '@/components/ui/UiDialogPanel.vue';
import ButtonWallet from '@/components/ButtonWallet.vue';
import AvatarUploader from '@/components/AvatarUploader.vue';

import { ref } from 'vue';
import { put } from '@/useApi.js';
import { success } from '@/notify.js';
import { userState } from '@/useLogin.js';
import { get } from '@/useApi.js';

const form = ref(null);
const data = ref({});

if (userState.data?.id) {
  getUser(userState.data.id);
}

async function getUser(id) {
  const { user } = await get(`/user/${id}/`);
  data.value = user;
}

const schema = [
  {
    $formkit: 'hidden',
    name: 'avatarUrl'
  },

  {
    $formkit: 'text',
    name: 'name',
    label: 'Display name',
    classes: {
      label: 'text-xl font-bold mb-2',
      input: 'placeholder:text-sm placeholder:opacity-30 placeholder:text-black w-full',
      outer: 'relative',
      messages: 'absolute right-0'
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
      messages: 'absolute right-0'
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
      messages: 'absolute right-0'
    },
    placeholder: 'Your Bio (maximum 400 symbols)',
    validation: 'length:1,400',
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
      messages: 'absolute right-0'
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
      messages: 'absolute right-0'
    },
    placeholder: 'https://...',
    validationVisibility: 'blur'
  }
];

async function submit(user) {
  const result = await put(`/user/${userState.data.id}/`, { user });
  if (result.success) {
    success({ text: 'User datails updated' })
  }
}
</script>

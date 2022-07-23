<template>
  <dialog-panel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white px-14 py-10 text-left align-middle shadow-xl transition-all">
    <slot />
  </dialog-panel>
</template>

<script setup>
import { DialogPanel } from '@headlessui/vue';
</script>

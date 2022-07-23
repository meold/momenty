<template>
  <dialog-title as="h3" class="text-xl mb-4 font-medium leading-6 text-gray-900">
    <slot />
  </dialog-title>
</template>

<script setup>
import { DialogTitle } from '@headlessui/vue';
</script>

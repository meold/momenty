<template>
  <button
    class="flex items-center justify-center px-8 py-4 bg-primary hover:opacity-90 hover:shadow-inner border-2 border-primary rounded-xl text-sm font-bold leading-none text-white"
    :class="{ 'opacity-60 pointer-events-none': disabled }"
  >
    <slot />
  </button>
</template>

<script setup>
defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
})
</script>
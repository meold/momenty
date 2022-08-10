<template>
  <drop-zone class="drop-zone w-full h-full flex justify-center items-center cursor-pointer" v-bind="$attrs">
    <div class="bg-gradient-to-r from-primary to-orange-100 relative w-1/2 rounded-[10%] overflow-hidden before:block before:content-[''] before:w-full before:pt-[100%]">
      <div class="drop-zone-target absolute inset-0 m-[3%] rounded-[8%] bg-white" />
      <div class="absolute inset-0 flex justify-center items-center">+</div>
    </div>
    <div class="absolute inset-x-0 bottom-0 flex justify-center items-center px-4 py-6 text-xs text-gray-300">
      <slot />
    </div>
  </drop-zone>
</template>

<script setup>
import DropZone from '@/components/DropZone.vue';

</script>

<style scoped lang="scss">
  .drop-zone {
    transition: background-color 0.3s linear;
    &:active, &.active {
      @apply bg-lime-50;
      .drop-zone-target {
        @apply bg-lime-50;
      }
    }
  }
</style>
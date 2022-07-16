<template>
  <div class="flex w-full">
    <div class="srink-0 grow-0 mr-14 hidden lg:block">
      <menu-vertical />
    </div>
    <div class="grow-1 flex flex-col items-center mx-auto">
      <h1 class="font-display text-5xl leading-tight my-20 text-primary">
        Not found
      </h1>
      <the-tron />
    </div>
  </div>
</template>

<script setup>
import MenuVertical from '@/components/MenuVertical.vue';
import TheTron from '@/components/TheTron.vue';
</script>

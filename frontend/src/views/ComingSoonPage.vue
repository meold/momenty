<template>
  <div class="flex w-full">
    <div class="srink-0 grow-0 mr-14 hidden lg:block">
      <menu-vertical />
    </div>
    <div class="grow-1 flex flex-col mx-auto items-center">
      <h1 class="font-display text-5xl leading-tight my-20 text-primary">
        Coming soon ...
      </h1>
      <the-poly class="text-primary" />
    </div>
  </div>
</template>

<script setup>
import MenuVertical from '@/components/MenuVertical.vue';
import ThePoly from '@/components/ThePoly.vue';
</script>

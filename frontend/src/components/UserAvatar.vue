<template>
  <img class="inline-block rounded-full border-2 border-primary group-hover:border-primary/80" :src="source" alt="">
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  src: {
    type: String,
    default: '/avatar-default.svg'
  }
})

const source = computed(() => props.src || '/avatar-default.svg');
</script>

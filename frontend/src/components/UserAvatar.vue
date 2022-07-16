<template>
  <img class="inline-block rounded-full border-2 border-primary group-hover:border-primary/80" :src="src" alt="">
</template>

<script setup>
// FIXME: add anonymous avatar
defineProps({
  src: {
    type: String,
    default: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  }
})
</script>

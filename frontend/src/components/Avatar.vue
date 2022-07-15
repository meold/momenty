<template>
  <div class="group flex items-center">
    <div>
      <img class="inline-block h-10 w-10 rounded-full border-2 border-primary group-hover:border-primary/80" :src="user.avatarUrl" alt="">
    </div>
    <div class="ml-3">
      <p class="text-sm font-medium">
        moment by
        <span class="text-primary underline underline-offset-2 ml-1 group-hover:opacity-80">{{ user.name }}</span>
      </p>
    </div>
  </div>
</template>

<script setup>
// FIXME: add anonymous avatar
defineProps({
  user: {
    type: Object,
    default: () => ({
      name: 'Tom Cook',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    })
  }
})
</script>

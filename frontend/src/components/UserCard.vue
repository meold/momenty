<template>
  <div class="group flex items-center">
    <div>
      <user-avatar class="h-10 w-10" :src="user.avatarUrl" />
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
import UserAvatar from '@/components/UserAvatar.vue';

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

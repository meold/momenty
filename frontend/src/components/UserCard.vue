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
      name: 'Elon Musk'
    })
  }
});

</script>

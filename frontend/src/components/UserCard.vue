<template>

  <router-link class="group flex items-center" :to="`/profile/${user?.id}`">
    <div class="shrink-0">
      <user-avatar class="h-10 w-10" :src="user.avatarUrl" />
    </div>
    <div class="ml-3" :class="{ truncate: isShort }">
      <p class="text-sm font-medium drop-shadow-[0_0_3px_rgba(255,255,255,1)]">
        <span v-if="!isShort">moment by</span>
        <span class="text-primary underline underline-offset-2 ml-1 group-hover:opacity-80">{{ user.name }}</span>
      </p>
    </div>
  </router-link>
</template>

<script setup>
import UserAvatar from '@/components/UserAvatar.vue';

defineProps({
  user: {
    type: Object,
    default: () => ({
      name: 'Elon Musk'
    })
  },
  isShort: {
    type: Boolean,
    default: false
  }
});

</script>

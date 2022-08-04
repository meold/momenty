<template>
  <the-header />

  <transition name="fade" mode="out-in">
    <the-banner />
  </transition>

  <router-view v-slot="{ Component }">
    <div class="container grow">
      <div class="lg:col-span-7">
        <transition name="fade" mode="out-in" appear>
          <component :is="Component" :key="$route.fullPath" />
        </transition>
      </div>
    </div>
  </router-view>

  <the-notifier />

  <the-footer />
</template>

<script setup>
import TheHeader from '@/components/TheHeader.vue';
import TheFooter from '@/components/TheFooter.vue';
import TheBanner from '@/components/TheBanner.vue';
import TheNotifier from '@/components/TheNotifier.vue';
import { useMetamask } from './useMetamask.js';
import { onMounted } from 'vue';

onMounted(useMetamask);
</script>

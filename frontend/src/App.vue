<template>
  <the-header />

  <transition name="fade" mode="out-in">
    <the-banner />
  </transition>

  <router-view v-slot="{ Component }">
    <div class="container grow">
      <div class="lg:col-span-7">
        <transition name="fade" mode="out-in" appear>
          <component :is="Component" :key="$route.path" />
        </transition>
      </div>
    </div>
  </router-view>

  <the-footer />
</template>

<script setup>
import TheHeader from '@/components/TheHeader.vue';
import TheFooter from '@/components/TheFooter.vue';
import TheBanner from '@/components/TheBanner.vue';
</script>

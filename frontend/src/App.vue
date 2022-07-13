<template>
  <the-header />

  <the-banner />

  <router-view v-slot="{ Component }">
    <div class="container grow">
      <div class="lg:col-span-7">
        <transition name="fade" mode="out-in" appear>
          <component :is="Component" :key="$route.path" />
        </transition>
      </div>
    </div>
  </router-view>

  <div class="py-10 container">
    <hr class="my-4">
    <tron-link-helper />
    <hr class="my-4">
  </div>

  <the-footer />
</template>

<script setup>
import TheHeader from '@/components/TheHeader.vue';
import TheFooter from '@/components/TheFooter.vue';
import TheBanner from '@/components/TheBanner.vue';
import TronLinkHelper from './components/TronLinkHelper.vue';

// FIXME:
window.addEventListener('message', e => {
  console.log(JSON.stringify(e), e.data?.message)
})
</script>

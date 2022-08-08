<template>
  <div class="flex w-full">
    <div class="srink-0 grow-0 mr-14 hidden lg:block">
      <menu-vertical />
    </div>

    <div class="grow">
      <nft-list
        :key="route.params.search"
        :title="`Search results for &quot;${route.params.search }&quot;`"
        url="/nft/search/"
        :url-options="{ search: route.params.search }"
      />
    </div>
  </div>
</template>

<script setup>
import MenuVertical from '@/components/MenuVertical.vue';
import { useRoute } from 'vue-router';
import NftList from '@/components/NftList.vue';

const route = useRoute();
</script>

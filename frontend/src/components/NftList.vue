<template>
  <h2 v-if="title" class="text-xl font-bold mb-2">{{ title }}</h2>
  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
    <div v-for="nft in nfts" :key="nft.id">
      <nft-card :nft="nft" />
    </div>
  </div>

  <vue-eternal-loading :load="load">
    <template #loading>
      <div class="flex justify-center items-center h-40">
        <spinner />
      </div>
    </template>

    <template #no-more>
      <div class="mt-4 opacity-40 text-center">
        No more moments
      </div>
    </template>

    <template #no-results>
      <div class="mt-4 text-primary opacity-40 text-center">
        No moments found
      </div>
    </template>
  </vue-eternal-loading>
</template>

<script setup>
import NftCard from '@/components/NftCard.vue';
import { VueEternalLoading } from '@ts-pro/vue-eternal-loading';
import Spinner from '@/components/Spinner.vue';
import { get } from '@/useApi.js';
import { ref } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: null
  },
  url: {
    type: String,
    default: null
  },
  urlOptions: {
    type: Object,
    default: () => ({})
  }
});

const PAGE_SIZE = 9;
let page = 0;
const nfts = ref([]);

async function load({ loaded }) {
  const { nfts: _nfts } = await get(props.url, { page, perPage: PAGE_SIZE, ...props.urlOptions });
  nfts.value.push(..._nfts);
  page += 1;

  loaded(_nfts.length, PAGE_SIZE);
}
</script>

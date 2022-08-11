<template>
  <h2 v-if="title" class="text-xl font-bold mb-2">{{ title }}</h2>
  <div class="gallery grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3">
    <div v-for="nft in nfts" :key="nft.id" class="select-none">
      <user-card :user="nft.user" is-short />
      <div class="flex">
        <div class="shrink-0 mr-2">
          <button-like :nft="nft" class="h-10 w-10 rounded-full !p-2 mt-2" />
          <button-share :nft="nft" class="h-10 w-10 rounded-full !p-2 mt-2" />
        </div>
        <nft-card :nft="nft" />
      </div>
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
import UserCard from '@/components/UserCard.vue';
import ButtonLike from '@/components/ButtonLike.vue';
import ButtonShare from '@/components/ButtonShare.vue';
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

const PAGE_SIZE = 3;
let page = 0;
const nfts = ref([]);

async function load({ loaded }) {
  const { nfts: _nfts } = await get(props.url, { page, perPage: PAGE_SIZE, ...props.urlOptions });
  nfts.value.push(..._nfts);
  page += 1;

  loaded(_nfts.length, PAGE_SIZE);
}
</script>

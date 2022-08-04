<template>
  <div class="flex w-full">
    <div class="srink-0 grow-0 mr-14 hidden lg:block">
      <menu-vertical />
    </div>

    <div class="grow">
      <h1 class="text-xl font-bold mb-2">
        <span class="capitalize">{{ section }}</span> moments
      </h1>

      <div v-if="!isNftsLoaded" class="flex justify-center items-center h-40">
        <spinner />
      </div>

      <div v-else-if="nfts.length" class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        <div v-for="nft in nfts" :key="nft.id">
          <nft-card :nft="nft" />
        </div>
      </div>

      <div v-else class="flex justify-center items-center h-40">
        No moments found
      </div>
    </div>
  </div>
</template>

<script setup>
import MenuVertical from '@/components/MenuVertical.vue';
import NftCard from '@/components/NftCard.vue';
import Spinner from '@/components/Spinner.vue';
import { get } from '@/useApi.js';
import { ref } from 'vue';

const props = defineProps({
  section: {
    type: String,
    default: null
  }
});

getNfts();

const nfts = ref([]);
const isNftsLoaded = ref(false);

async function getNfts() {
  const { nfts: _nfts } = await get(`/nft/section/${props.section}/`);
  nfts.value = _nfts;
  isNftsLoaded.value = true;
}
</script>

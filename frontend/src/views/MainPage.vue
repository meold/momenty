<template>
  <div class="flex w-full">
    <div class="srink-0 grow-0 mr-14 hidden lg:block">
      <menu-vertical />
    </div>

    <div class="grow">
      <div class="flex">
        <div class="grow">
          <h1 class="font-display text-5xl leading-tight mt-20">
            Create your first decentralized <div class="text-primary">moment as NFT</div>
          </h1>
          <router-link v-slot="{ navigate }" to="/new" custom>
            <button-primary class="text-3xl my-10" @click="navigate" @keypress.enter="navigate">
              Create moment
              <span class="ml-2 text-2xl">+</span>
            </button-primary>
          </router-link>
        </div>
        <div class="srink-0 grow-0 hidden xl:block">
          <the-tron />
        </div>
      </div>

      <h2 class="text-xl font-bold mt-28 -mb-5">New</h2>
      <div v-if="!isNewNftsLoaded" class="grow flex justify-center items-center h-40">
        <spinner class="!w-10 !h-10" />
      </div>
      <carousel v-else :nfts="newNfts" />

      <h2 class="text-xl font-bold mt-14 -mb-5">Trending</h2>
      <div v-if="!isTrandingNftsLoaded" class="grow flex justify-center items-center h-40">
        <spinner class="!w-10 !h-10" />
      </div>
      <carousel v-else :nfts="trandingNfts" />
    </div>
  </div>
</template>

<script setup>
import MenuVertical from '@/components/MenuVertical.vue';
import ButtonPrimary from '@/components/ButtonPrimary.vue';
import TheTron from '@/components/TheTron.vue';
import Carousel from '@/components/Carousel.vue';
import Spinner from '@/components/Spinner.vue';
import { get } from '@/useApi.js';
import { ref } from 'vue';

const newNfts = ref([]);
const isNewNftsLoaded = ref(false);
const trandingNfts = ref([]);
const isTrandingNftsLoaded = ref(false);

getNewNfts();
getTrandingNfts();

async function getNewNfts() {
  const { nfts } = await get(`/nft/section/new/`);
  newNfts.value = nfts;
  isNewNftsLoaded.value = true;
}

async function getTrandingNfts() {
  const { nfts } = await get(`/nft/section/trending/`);
  trandingNfts.value = nfts;
  isTrandingNftsLoaded.value = true;
}
</script>

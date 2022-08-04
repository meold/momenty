<template>
  <div class="flex w-full">
    <div class="srink-0 grow-0 mr-14 hidden lg:block">
      <menu-vertical />
    </div>

    <div class="grow">
      <div class="flex">
        <div class="grow max-w-2xl">
          <h1 class="font-display text-5xl leading-tight mt-20">
            Create your first decentralized <div class="text-primary">moment as NFT</div>
          </h1>
          <router-link v-slot="{ navigate }" to="/new" custom>
            <button-primary class="text-3xl mt-10" @click="navigate" @keypress.enter="navigate">
              Create moment
              <span class="ml-2 text-2xl">+</span>
            </button-primary>
          </router-link>
        </div>
        <div v-if="!isPolyHidden" class="srink-0 grow-0 flex items-end ml-20">
          <the-poly class="text-primary" />
        </div>
      </div>

      <h2 class="text-xl font-bold mt-28 -mb-5">New</h2>
      <div v-if="!isNewNftsLoaded" class="grow flex justify-center items-center h-40">
        <spinner />
      </div>
      <carousel v-else :nfts="newNfts" />

      <h2 class="text-xl font-bold mt-14 -mb-5">Trending</h2>
      <div v-if="!isTrandingNftsLoaded" class="grow flex justify-center items-center h-40">
        <spinner />
      </div>
      <carousel v-else :nfts="trandingNfts" />
    </div>
  </div>
</template>

<script setup>
import MenuVertical from '@/components/MenuVertical.vue';
import ButtonPrimary from '@/components/ButtonPrimary.vue';
import ThePoly from '@/components/ThePoly.vue';
import Carousel from '@/components/Carousel.vue';
import Spinner from '@/components/Spinner.vue';
import { get } from '@/useApi.js';
import { ref } from 'vue';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

const breakpoints = useBreakpoints(breakpointsTailwind)
const isPolyHidden = breakpoints.smaller('xl');


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

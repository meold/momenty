<template>
  <div>
    <div class="flex flex-row gap-x-20 max-w-5xl mx-auto">
      <div class="shrink-0 basis-1/3 max-w-[240px]">
        <nft-card :nft="nft" />
      </div>

      <div v-if="isNftLoaded" class="grow">

        <div class="mb-8 flex justify-between items-center">
          <router-link class="inline-block" :to="`/profile/${nft.user?.id}`">
            <user-card :user="nft.user" />
          </router-link>
          <button-primary v-if="!isCurrentUser" class="!py-3">Follow</button-primary>
        </div>

        <h1 class="font-display text-2xl leading-tight mb-4">
          {{ nft.title }}
        </h1>

        <p class="opacity-50 text-sm mb-8">
          {{ nft.description }}
        </p>

        <nft-sell v-if="isCurrentUser" :nft="nft" />
        <nft-buy v-else :nft="nft" />
      </div>

      <div v-else class="grow flex justify-center items-center h-40">
        <spinner />
      </div>
    </div>

    <hr class="border border-gray-300 my-14">

    <h2 class="text-xl font-bold mt-14 -mb-5">Other author Moments</h2>

    <div v-if="!isNftsLoaded" class="grow flex justify-center items-center h-40">
      <spinner />
    </div>

    <carousel v-if="nfts.length" :nfts="nfts" />

    <div v-else class="flex justify-center items-center h-40">
      No moments found
    </div>
  </div>
</template>

<script setup>
import NftBuy from '@/components/NftBuy.vue';
import NftSell from '@/components/NftSell.vue';
import NftCard from '@/components/NftCard.vue';
import UserCard from '@/components/UserCard.vue';
import Carousel from '@/components/Carousel.vue';
import Spinner from '@/components/Spinner.vue';
import ButtonPrimary from '@/components/ButtonPrimary.vue';
import { ref, watch, computed } from 'vue';
import { get } from '@/useApi.js';
import { userState } from '@/useLogin.js';

const props = defineProps({
  id: {
    type: [Number, String],
    default: null
  }
});

watch(
  () => props.id,
  val => {
    getNft(val)
  }
);

getNft();

const isCurrentUser = computed(() => nft.value?.user?.id == userState.data?.id);

const nft = ref({});
const nfts = ref([]);
const isNftLoaded = ref(false);
const isNftsLoaded = ref(false);

async function getNft() {
  const { nft: _nft } = await get(`/nft/${props.id}/`);
  nft.value = _nft;
  isNftLoaded.value = true;
  await getNfts();
}

async function getNfts() {
  if (!nft.value?.user?.id) {
    return;
  }
  const { nfts: _nfts } = await get(`/nft/`, { userId: nft.value?.user?.id });
  nfts.value = _nfts;
  isNftsLoaded.value = true;
}
</script>

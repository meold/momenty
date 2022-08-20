<template>
  <hr class="mb-10">

  <nft-mint v-if="!isMinted" :nft="nft" />

  <template v-else>

    <div class="mt-10 mb-3">
      Current price
    </div>

    <div class="font-bold text-2xl mb-5">
      <input v-model.number="sellPrice" type="number">
      MATIC
    </div>

    <div class="flex gap-x-3">

      <button-primary :disabled="isButtonDisabled" class="relative" @click="onClick">
        <spinner v-if="isSubmitting" class="absolute left-2 !fill-white !w-5 mr-1" />
        {{ buttonText }}
      </button-primary>

      <!-- <button-primary @click="approve">Approve</button-primary>

      <button-primary @click="sell">Sell</button-primary> -->

      <!-- <button-primary @click="getInfo">Info</button-primary> -->

      <button-like :nft="nft" class="!p-3 w-12 h-12" />
      <button-share :nft="nft" class="!p-3 w-12 h-12" />
    </div>
  </template>
</template>

<script setup>
import ButtonLike from '@/components/ButtonLike.vue';
import ButtonShare from '@/components/ButtonShare.vue';
import ButtonPrimary from './ButtonPrimary.vue';
import NftMint from './NftMint.vue';
import Spinner from './Spinner.vue';
import { approveSellNft, sellNft, getNftListing, parseEther } from '@/useContracts';

import { computed, ref, shallowRef } from 'vue';

const props = defineProps({
  nft: {
    type: Object,
    default: () => ({})
  }
});

const sellPrice = ref(props.nft.price || '0.0');
const isSubmitting = shallowRef(false);

const isMinted = computed(() => Boolean(props.nft.tokenId));

const isButtonDisabled = computed(() => isSubmitting.value || !sellPrice.value || sellPrice.value <= 0);

const buttonText = shallowRef('Sell');

async function onClick() {

  const price = parseEther(`${sellPrice.value}`);

  isSubmitting.value = true;
  buttonText.value = 'Approving';

  await approveSellNft(import.meta.env.VITE_MOMENT_MARKETPLACE, 4);
  buttonText.value = 'Approved';
  await sellNft(import.meta.env.VITE_MOMENT_CONTRACT, props.nft.tokenId, price);

  isSubmitting.value = false;
}

async function approve() {
  await approveSellNft(import.meta.env.VITE_MOMENT_MARKETPLACE, props.nft.tokenId);
}

async function sell() {
  const price = parseEther(`${sellPrice.value}`);
  await sellNft(import.meta.env.VITE_MOMENT_CONTRACT, props.nft.tokenId, price);
}

// async function getInfo() {
//   const result = getNftListing(props.nft.tokenId);
//   console.log(result)
// }
</script>

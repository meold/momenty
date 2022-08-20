<template>
  <hr class="mb-10">

  <nft-mint v-if="!isMinted" :nft="nft" />

  <template v-else-if="!isSelling">

    <div class="mt-10 mb-3">
      Current price
    </div>

    <div class="font-bold text-2xl mb-5">
      <input v-model.number="sellPrice" type="number">
      MATIC
    </div>

    <div class="flex gap-x-3">
      <div class="shrink-0">
        <button-primary :disabled="isButtonDisabled" class="relative" @click="onClick">
          <spinner v-if="isSubmitting" class="absolute left-2 !fill-white !w-5 mr-1" />
          {{ buttonText }}
        </button-primary>
      </div>

      <alert-error v-if="!isChainIdValid" title="Wrong chain">
        Please connect Metamask to {{ DEFAULT_CHAIN_NAME }} chain
      </alert-error>

      <button-like :nft="nft" class="!p-3 w-12 h-12" />
      <button-share :nft="nft" class="!p-3 w-12 h-12" />
    </div>
  </template>

  <template v-else>
    <div class="mt-10 mb-3">
      Your moment is listed for sale
    </div>

    <div class="font-bold text-2xl mb-5">
      <input :value="nft.price" type="number" readonly>
      MATIC
    </div>
  </template>
</template>

<script setup>
import ButtonLike from '@/components/ButtonLike.vue';
import ButtonShare from '@/components/ButtonShare.vue';
import ButtonPrimary from './ButtonPrimary.vue';
import AlertError from './AlertError.vue';
import NftMint from './NftMint.vue';
import Spinner from './Spinner.vue';
import { approveSellNft, sellNft, parseEther, isApproved } from '@/useContracts';
import { error, success } from '@/notify';
import { put } from '@/useApi.js';
import { computed, ref, shallowRef } from 'vue';
import { isChainIdValid, DEFAULT_CHAIN_NAME } from '@/useMetamask';

const props = defineProps({
  nft: {
    type: Object,
    default: () => ({})
  }
});

const sellPrice = ref('0.0');
const isSubmitting = shallowRef(false);

const isMinted = computed(() => Boolean(props.nft.tokenId));
const isSelling = computed(() => Boolean(props.nft.price));

const isButtonDisabled = computed(() => isSubmitting.value || !sellPrice.value || sellPrice.value <= 0);

const buttonText = shallowRef('Sell');


async function onClick() {
  const price = parseEther(`${sellPrice.value}`);

  isSubmitting.value = true;
  buttonText.value = 'Approving';

  const _isApproved = await isApproved(props.nft.tokenId);

  if (!_isApproved) {
    try {
      await approveSellNft(props.nft.tokenId);
    } catch (err) {
      isSubmitting.value = false;
      if (err.code == 4001) {
        return;
      }
      error({ title: "Can't mint nft", text: err.message })
      return;
    }
  }

  buttonText.value = 'Approved';
  let transaction;
  try {
    transaction = await sellNft(props.nft.tokenId, price);
  } catch (err) {
    isSubmitting.value = false;
    if (err.code == 4001) {
      return;
    }
    error({ title: "Can't mint nft", text: err.message })
    return;
  }
  buttonText.value = 'Selling';
  await transaction.wait();

  const result = await put(`/nft/${props.nft.id}/`, { price: sellPrice.value })

  isSubmitting.value = false;
  if (result.success) {
    success({ text: 'Your moment is listed for sale!' });
    // eslint-disable-next-line vue/no-mutating-props
    props.nft.price = sellPrice.value;
  }
}
</script>

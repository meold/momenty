<template>
  <div class="mb-3">
    Current price
  </div>

  <div class="font-bold text-2xl mb-5">
    <component :is="nft.price ? 'span' : 's'">
      {{ nft.price || '0.0' }} MATIC
    </component>
  </div>

  <div class="flex gap-x-3 mb-3">
    <button-primary :disabled="isButtonDisabled" class="relative" @click="buy">
      <spinner v-if="isSubmitting" class="absolute left-2 !fill-white !w-5 mr-1" />
      {{ buttonText }}
    </button-primary>

    <button-like :nft="nft" class="!p-3 w-12 h-12" />
    <button-share :nft="nft" class="!p-3 w-12 h-12" />
  </div>

  <alert-wrong-chain />
</template>

<script setup>
import ButtonLike from '@/components/ButtonLike.vue';
import ButtonShare from '@/components/ButtonShare.vue';
import ButtonPrimary from './ButtonPrimary.vue';
import AlertWrongChain from './AlertWrongChain.vue';
import { parseEther, buyNft } from '@/useContracts';
import { isChainIdValid } from '@/useMetamask';
import { shallowRef, computed } from 'vue';
import Spinner from './Spinner.vue';
import { error, success } from '@/notify';
import { put } from '@/useApi.js';
import { userState } from '@/useLogin.js';

const props = defineProps({
  nft: {
    type: Object,
    default: () => ({})
  }
});

const isSubmitting = shallowRef(false);
const buttonText = shallowRef('Buy');

const isSelling = computed(() => Boolean(props.nft.tokenId && props.nft.price));

const isButtonDisabled = computed(() => isSubmitting.value || !isSelling.value || !isChainIdValid.value || !userState.isLogged);

async function buy() {
  if (isButtonDisabled.value) {
    return;
  }

  const price = parseEther(props.nft.price);

  isSubmitting.value = true;
  buttonText.value = 'Buying';

  let transaction;
  try {
    transaction = await buyNft(props.nft.tokenId, price);
  } catch (err) {
    isSubmitting.value = false;
    if (err.code == 4001) {
      return;
    }
    error({ title: "Can't buy nft", text: err.message })
    return;
  }

  await transaction.wait();

  const result = await put(`/nft/${props.nft.id}/`, { userId: userState.data.id });

  isSubmitting.value = false;
  if (result.success) {
    success({ text: 'You ary bought the moment!' });
    // eslint-disable-next-line vue/no-mutating-props
    props.nft.userId = userState.data.id;
  }
}
</script>

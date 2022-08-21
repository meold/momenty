<template>
  <div class="flex gap-x-3 mb-3">
    <button-primary :disabled="isButtonDisabled" class="relative" @click="mint">
      <spinner v-if="isSubmitting" class="absolute left-2 !fill-white !w-5 mr-1" />
      Mint
    </button-primary>

    <button-like :nft="nft" class="!p-3 w-12 h-12" />
    <button-share :nft="nft" class="!p-3 w-12 h-12" />
  </div>

  <alert-wrong-chain v-if="!isChainIdValid" />

  <alert-error v-else-if="!isMintReady" title="Mint is not ready yet">
    It could take some time to prepare moment for minting.
    You can wait here or come back later.
  </alert-error>
</template>

<script setup>
import ButtonPrimary from './ButtonPrimary.vue';
import ButtonLike from '@/components/ButtonLike.vue';
import ButtonShare from '@/components/ButtonShare.vue';
import AlertWrongChain from './AlertWrongChain.vue';
import { mintNft } from '@/useContracts';
import { web3, isChainIdValid } from '@/useMetamask';
import { computed, shallowRef } from 'vue';
import { get, put } from '@/useApi.js';
import { error, success } from '@/notify';
import Spinner from './Spinner.vue';

const props = defineProps({
  nft: {
    type: Object,
    default: () => ({})
  }
});

const isMintReady = shallowRef(Boolean(props.nft.metadataUri));
const isSubmitting = shallowRef(false);

const isButtonDisabled = computed(() => !isMintReady.value || !isChainIdValid.value || isSubmitting.value);

if (!isMintReady.value) {
  reloadNft();
}

async function reloadNft() {
  const { nft } = await get(`/nft/${props.nft.id}/`);
  if (nft.metadataUri) {
    // eslint-disable-next-line vue/no-mutating-props
    props.nft.metadataUri = nft.metadataUri;
    isMintReady.value = true;
    return;
  }
  if (nft.isIpfsUploadFailed) {
    return;
  }
  setTimeout(reloadNft, 3000);
}

async function mint() {
  if (!props.nft.metadataUri) {
    return;
  }

  isSubmitting.value = true;

  let transaction;
  try {
    transaction = await mintNft(web3.address, props.nft.metadataUri);
  } catch (err) {
    isSubmitting.value = false;
    if (err.code == 4001) {
      return;
    }
    error({ title: "Can't mint nft", text: err.message });
    return;
  }

  const receipt = await transaction.wait();

  let tokenId = null;
  for (const event of receipt.events) {
    if (event.event === "Transfer") {
      tokenId = event.args.tokenId.toString();
    }
  }

  const result = await put(`/nft/${props.nft.id}/`, { tokenId })

  isSubmitting.value = false;
  if (result.success) {
    success({ text: 'Your moment was minted!' });
    // eslint-disable-next-line vue/no-mutating-props
    props.nft.tokenId = tokenId;
  }
}
</script>
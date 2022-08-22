<template>
  <alert-error v-if="!isChainIdValid">
    <div class="flex flex-col md:flex-row gap-3">
      <div class="flex-grow">
        <h3 class="text-sm font-bold text-red-800 mb-2">Wrong chain</h3>
        Please connect Metamask to {{ DEFAULT_CHAIN_NAME }} chain
      </div>
      <div class="shrink-0">
        <button-secondary class="border-red-800 !hover:bg-red-100" @click="switchToDefaultChain">Connect</button-secondary>
      </div>
    </div>
  </alert-error>
</template>

<script setup>
import AlertError from './AlertError.vue';
import { isChainIdValid, DEFAULT_CHAIN_NAME, switchToDefaultChain } from '@/useMetamask';
import ButtonSecondary from './ButtonSecondary.vue';
</script>
<template>
  <div class="mb-3">
    Current price
  </div>


  <button-primary @click="buy">Buy</button-primary>

  <div class="font-bold text-2xl mb-5">
    999 MATIC
  </div>

  <div class="flex gap-x-3">
    <!-- <a href="#" target="_blank" class="flex items-center justify-center px-8 bg-primary hover:opacity-90 hover:shadow-inner border-2 border-primary rounded-xl text-sm font-bold leading-none text-white py-3">
      Buy NFT
    </a> -->
    <button-like :nft="nft" class="!p-3 w-12 h-12" />
    <button-share :nft="nft" class="!p-3 w-12 h-12" />
  </div>
</template>

<script setup>
import ButtonLike from '@/components/ButtonLike.vue';
import ButtonShare from '@/components/ButtonShare.vue';

import ButtonPrimary from './ButtonPrimary.vue';
// import marketplaceABI from '@/artifacts/MomentMarketplace.json';
// import { web3 } from '@/useMetamask';

defineProps({
  nft: {
    type: Object,
    default: () => ({})
  }
});

// const momentId = 3;

// // FIXME: check is MM connected and chainId is mumbai

// const provider = new ethers.providers.Web3Provider(web3.instance);
// const signer = provider.getSigner();
// const marketplaceContract = new ethers.Contract(import.meta.env.VITE_MOMENT_MARKETPLACE, marketplaceABI, signer);

// async function buy() {
//   const price = ethers.utils.parseEther("0.0001"); // GET from info
//   await marketplaceContract.buyMoment(import.meta.env.VITE_MOMENT_CONTRACT, momentId, { value: price });
// }
</script>

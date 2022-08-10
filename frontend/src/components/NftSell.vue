<template>
  <div class="mb-3">
    Current price
  </div>

  <div class="font-bold text-2xl mb-5">
    <input type="number" value="999">
    TRX
  </div>

  <div class="flex gap-x-3">
    <a href="#" target="_blank" class="flex items-center justify-center px-8 bg-primary hover:opacity-90 hover:shadow-inner border-2 border-primary rounded-xl text-sm font-bold leading-none text-white py-3">
      Sell NFT
    </a>
    <button-like :nft="nft" class="!p-3 w-12 h-12" />
    <button-share :nft="nft" class="!p-3 w-12 h-12" />
  </div>
</template>

<script setup>
import ButtonLike from '@/components/ButtonLike.vue';
import ButtonShare from '@/components/ButtonShare.vue';

defineProps({
  nft: {
    type: Object,
    default: () => ({})
  }
});
</script>

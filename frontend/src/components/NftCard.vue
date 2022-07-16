<template>
  <nft-card-container class="rounded-none shadow-none overflow-visible" @click="onClick">
    <div class="flip-container w-full h-full" :class="{ hover: isFlipped }" @touchstart="onTouchstart">
      <div class="flipper">
        <div class="front w-full h-full">
          <nft-card-container class="!shadow-sm bg-primary/20" />
        </div>
        <div class="back w-full h-full">
          <nft-card-container class="!shadow-sm bg-lime-300" />
        </div>
      </div>
    </div>
  </nft-card-container>
</template>

<script setup>
import { ref } from 'vue';
import NftCardContainer from './NftCardContainer.vue';

const isFlipped = ref(false);

defineProps({
  nft: {
    type: Number,
    default: 0
  }
})

function onTouchstart() {
  isFlipped.value = !isFlipped.value;
}

function onClick() {
  isFlipped.value = !isFlipped.value;
}
</script>

<style scoped>
.flip-container {
  perspective: 1000px;
}

.flip-container:hover .flipper, .flip-container.hover .flipper {
  transform: rotateY(180deg);
}

.flipper {
  transition: 0.6s;
  transform-style: preserve-3d;
  position: relative;
}

.front, .back {
  backface-visibility: hidden;
  position: absolute;
  top: 0;
  left: 0;
}

.front {
  z-index: 2;
  transform: rotateY(0deg);
}

.back {
  transform: rotateY(180deg);
}
</style>
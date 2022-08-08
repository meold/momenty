<template>
  <router-link v-slot="{ navigate }" :to="`/view/${nft.id}`" custom>
    <nft-card-container class="!rounded-none !shadow-none overflow-visible cursor-pointer" @click="navigate">
      <div class="flip-container w-full h-full" :class="{ hover: isFlipped }" @touchstart="isFlipped = !isFlipped" @mouseenter="onMouseenter" @mouseleave="onMouseleave">
        <div class="flipper">
          <div class="front w-full h-full">
            <nft-card-container class="!shadow-lg border">
              <img :src="nft.image" class="w-full h-full object-cover" alt="">
            </nft-card-container>
          </div>
          <div class="back w-full h-full relative">
            <nft-card-container class="!shadow-lg border">
              <video-player class="w-full h-full" :src="nft.video" :play="isFlipped" :is-unmuted="isUnmuted" />
            </nft-card-container>

            <button class="absolute top-0 right-0 m-[7%] text-primary hover:opacity-80" @click.stop.prevent="isUnmuted = !isUnmuted">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 drop-shadow-sm" :fill="isUnmuted ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clip-rule="evenodd" />
                <path v-if="!isUnmuted" stroke-linecap="round" stroke-linejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nft-card-container>
  </router-link>
</template>

<script setup>
import { ref } from 'vue';
import NftCardContainer from './NftCardContainer.vue';
import VideoPlayer from '../components/VideoPlayer.vue';

const isFlipped = ref(false);
const isUnmuted = ref(false);

defineProps({
  nft: {
    type: Object,
    default: () => {}
  }
})

function onMouseenter() {
  isFlipped.value = true;
}

function onMouseleave() {
  isFlipped.value = false;
}

</script>

<style scoped>
.flip-container {
  perspective: 1000px;
}
/* .flip-container:hover .flipper, */
.flip-container.hover .flipper {
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
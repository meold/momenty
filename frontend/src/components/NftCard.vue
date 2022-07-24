<template>
  <router-link v-slot="{ navigate }" to="/view" custom>
    <nft-card-container class="!rounded-none !shadow-none overflow-visible cursor-pointer" @click="navigate">
      <div class="flip-container w-full h-full" :class="{ hover: isFlipped }" @touchstart="isFlipped = !isFlipped" @mouseenter="onMouseenter" @mouseleave="onMouseleave">
        <div class="flipper">
          <div class="front w-full h-full">
            <nft-card-container class="!shadow-sm">
              <img :src="nft.image || '/killme/image2.png'" class="w-full h-full object-cover" alt="">
            </nft-card-container>
          </div>
          <div class="back w-full h-full">
            <nft-card-container class="!shadow-sm">
              <video-player class="w-full h-full" :src="nft.video || '/killme/vid.mov'" :play="isFlipped" />
            </nft-card-container>
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
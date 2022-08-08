<template>
  <div class="w-96 relative">
    <svg
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 38.4 33.5"
    >
      <path
        fill="currentColor"
        d="M29,10.2c-0.7-0.4-1.6-0.4-2.4,0L21,13.5l-3.8,2.1l-5.5,3.3c-0.7,0.4-1.6,0.4-2.4,0L5,16.3
          c-0.7-0.4-1.2-1.2-1.2-2.1v-5c0-0.8,0.4-1.6,1.2-2.1l4.3-2.5c0.7-0.4,1.6-0.4,2.4,0L16,7.2c0.7,0.4,1.2,1.2,1.2,2.1v3.3l3.8-2.2V7
          c0-0.8-0.4-1.6-1.2-2.1l-8-4.7c-0.7-0.4-1.6-0.4-2.4,0L1.2,5C0.4,5.4,0,6.2,0,7v9.4c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7
          c0.7,0.4,1.6,0.4,2.4,0l5.5-3.2l3.8-2.2l5.5-3.2c0.7-0.4,1.6-0.4,2.4,0l4.3,2.5c0.7,0.4,1.2,1.2,1.2,2.1v5c0,0.8-0.4,1.6-1.2,2.1
          L29,28.8c-0.7,0.4-1.6,0.4-2.4,0l-4.3-2.5c-0.7-0.4-1.2-1.2-1.2-2.1V21l-3.8,2.2v3.3c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7
          c0.7,0.4,1.6,0.4,2.4,0l8.1-4.7c0.7-0.4,1.2-1.2,1.2-2.1V17c0-0.8-0.4-1.6-1.2-2.1L29,10.2z"
      />
    </svg>

    <div class="cube-1">
      <div class="image image-1">
        <img :src="images[0]" alt="">
      </div>
      <div class="image image-2">
        <img :src="images[1]" alt="">
      </div>
      <div class="image image-3">
        <img :src="images[2]" alt="">
      </div>
    </div>

    <div class="cube-2">
      <div class="image image-1">
        <img :src="images[3]" alt="">
      </div>
      <div class="image image-2">
        <img :src="images[4]" alt="">
      </div>
      <div class="image image-3">
        <img :src="images[5]" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import { get } from '@/useApi.js';

export default {
  data() {

    return {
      nonce: 4,
      previous: 0,
      interval: null,
      keys: [0, 1, 2, 3],
      classes: ['opacity-80', 'opacity-90', 'opacity-100', 'opacity-75'],
      images: []
    };
  },

  async created() {
    this.images = await Promise.all([
      this.getImage(),
      this.getImage(),
      this.getImage(),
      this.getImage(),
      this.getImage(),
      this.getImage()
    ]);
  },

  mounted() {
    this.interval = setInterval(async () => {
      let rand;
      do {
        rand = Math.floor(Math.random() * 6)
      } while (rand === this.previous);

      this.previous = rand;
      this.images[rand] = await this.getImage();
      this.keys[rand] = this.nonce;
    }, 6000);
  },

  beforeUnmount() {
    clearInterval(this.interval);
  },

  methods: {
    async getImage() {
      this.nonce++;
      const { image } = await get('/nft/image/', { q: this.nonce }, { onError: () => {} });
      return image;
    }
  }
};
</script>

<style>
.image {
  width: 58px;
  height: 58px;
  @apply absolute skew-y-12 rounded-lg overflow-hidden shadow;
}
.image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.cube-1 {
  position: absolute;
  top: 56px;
  left: 45px;
}
.cube-2 {
  position: absolute;
  top: 155px;
  left: 217px;
}
.image-1 {
  top: 0px;
  left: 31px;
  transform: scalex(1.5) scaleY(0.85) rotate(45deg);
}
.image-2 {
  top: 52px;
  left: 0px;
  transform: skewY(30deg);
}
.image-3 {
  top: 52px;
  left: 63px;
  transform: skewY(-30deg);
}


.slowfade-enter-active,
.slowfade-leave-active {
  opacity: 1;
  transition-property: opacity;
  transition-timing-function: ease;
}

.slowfade-enter-active {
  transition-duration: 3s;
}

.slowfade-leave-active {
  transition-duration: 1s;
}

.slowfade-enter,
.slowfade-leave-active {
  opacity: 0;
}
</style>

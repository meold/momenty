<template>
  <Carousel v-if="nfts.length" :settings="settings" :breakpoints="breakpoints">

    <Slide v-for="nft in nfts" :key="nft.id">
      <div class="carousel__item py-8">
        <nft-card :nft="nft" />
      </div>
    </Slide>

    <template #addons>
      <Navigation />
    </template>
  </Carousel>
</template>

<script>
import { defineComponent } from 'vue';
import { Carousel, Navigation, Slide } from 'vue3-carousel';
import NftCard from '@/components/NftCard.vue';

export default defineComponent({
  components: {
    Carousel,
    Slide,
    Navigation,
    NftCard
  },
  props: {
    nfts: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    // carousel settings
    settings: {
      wrapAround: false,
      itemsToShow: 1,
      snapAlign: 'center'
    },
    // breakpoints are mobile first
    // any settings not specified will fallback to the carousel settings
    breakpoints: {
      // 700px and up
      700: {
        itemsToShow: 3,
        snapAlign: 'center'
      },
      // 1024 and up
      1024: {
        itemsToShow: 5,
        snapAlign: 'start'
      }
    }
  })
});
</script>

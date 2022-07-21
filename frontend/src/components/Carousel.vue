<template>
  <Carousel :settings="settings" :breakpoints="breakpoints">

    <Slide v-for="slide in 10" :key="slide">
      <div class="carousel__item py-8">
        <nft-card :nft="slide + salt" />
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
  name: 'Breakpoints',
  components: {
    Carousel,
    Slide,
    Navigation,
    NftCard
  },
  data: () => ({
    salt: parseInt(10 * Math.random(), 10), // FIXME: kill this
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

<style lang="scss">
section.carousel {
  margin-left: -10px;
  margin-right: -10px;
  .carousel__item {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .carousel__slide {
      padding: 0 10px;
  }

  .carousel__prev,
  .carousel__next {
    border: 2px solid var(--vc-nav-background-color);
    border-radius: 8px;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    &:hover {
      opacity: 0.8;
      box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
    }
  }

  .carousel__prev {
    left: 35px;
  }

  .carousel__next {
    right: 35px;
  }

  .carousel__prev--in-active,
  .carousel__next--in-active {
    color: var(--vc-nav-background-color);
    background-color: #ffffff55;
    cursor: default;
  }
}
</style>
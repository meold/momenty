<template>
  <div class="flex w-full">
    <div class="srink-0 grow-0 mr-14 hidden lg:block">
      <menu-vertical />
    </div>

    <div class="grow">
      <div class="flex">
        <div class="grow">
          <h1 class="font-display text-5xl leading-tight mt-20">
            Create your first decentralized <div class="text-primary">moment as NFT</div>
          </h1>
          <router-link v-slot="{ navigate }" to="/new" custom>
            <button-primary class="text-3xl my-10" @click="navigate" @keypress.enter="navigate">
              Create moment
              <span class="ml-2 text-2xl">+</span>
            </button-primary>
          </router-link>
        </div>
        <div class="srink-0 grow-0 hidden xl:block">
          <the-tron />
        </div>
      </div>

      <div v-if="false" class="FIXME: kill it">
        <!--  -->
      </div>

      <h2 class="text-xl font-bold mt-28 -mb-5">New</h2>
      <carousel />

      <h2 class="text-xl font-bold mt-14 -mb-5">Trending</h2>
      <carousel />
    </div>
  </div>
</template>

<script setup>
import MenuVertical from '@/components/MenuVertical.vue';
import ButtonPrimary from '@/components/ButtonPrimary.vue';
import TheTron from '@/components/TheTron.vue';
import Carousel from '../components/Carousel.vue';
</script>

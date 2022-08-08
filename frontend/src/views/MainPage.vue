<template>
  <div class="flex w-full">
    <div class="srink-0 grow-0 mr-14 hidden lg:block">
      <menu-vertical />
    </div>

    <div class="grow">
      <div class="flex mb-28">
        <div class="grow max-w-2xl">
          <h1 class="font-display text-5xl leading-tight mt-20">
            Create your first decentralized <div class="text-primary">moment as NFT</div>
          </h1>
          <router-link v-slot="{ navigate }" to="/new" custom>
            <button-primary class="text-3xl mt-10" @click="navigate" @keypress.enter="navigate">
              Create moment
              <span class="ml-2 text-2xl">+</span>
            </button-primary>
          </router-link>
        </div>
        <div v-if="!isPolyHidden" class="srink-0 grow-0 flex items-end ml-20">
          <the-poly class="text-primary" />
        </div>
      </div>

      <nft-list title="New" url="/nft/section/new/" />
    </div>
  </div>
</template>

<script setup>
import MenuVertical from '@/components/MenuVertical.vue';
import ButtonPrimary from '@/components/ButtonPrimary.vue';
import ThePoly from '@/components/ThePoly.vue';
import NftList from '@/components/NftList.vue';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

const breakpoints = useBreakpoints(breakpointsTailwind)
const isPolyHidden = breakpoints.smaller('xl');

</script>

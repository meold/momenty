<template>
  <div class="flex w-full">
    <div class="srink-0 grow-0 mr-14 hidden lg:block">
      <menu-vertical />
    </div>
    <div class="grow-1">
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
</template>

<script>
import MenuVertical from '@/components/MenuVertical.vue';
import ButtonPrimary from '@/components/ButtonPrimary.vue';
import TheTron from '@/components/TheTron.vue';

export default {
  components: {
    MenuVertical,
    ButtonPrimary,
    TheTron
  },
  props: [],
  data() {
    return {

    };
  },
  computed: {

  },
  watch: {

  },
  methods: {

  }
};
</script>

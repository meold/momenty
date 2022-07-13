<template>
  <div class="flex w-full">
    <div class="srink-0 mr-14">
      <menu-vertical />
    </div>
    <div class="grow-1">
      <h1 class="font-display text-5xl mt-20">
        Create your first decentralized <div class="text-primary">moment as NFT</div>
      </h1>
      <router-link v-slot="{ navigate }" to="/new" custom>
        <button-primary class="text-3xl my-10" @click="navigate" @keypress.enter="navigate">
          Create moment
          <span class="ml-2 text-2xl">+</span>
        </button-primary>
      </router-link>
    </div>
  </div>
</template>

<script>
import MenuVertical from '@/components/MenuVertical.vue';
import ButtonPrimary from '@/components/ButtonPrimary.vue';

export default {
  components: {
    MenuVertical,
    ButtonPrimary
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

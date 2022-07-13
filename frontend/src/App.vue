<template>
  <the-header />

  <the-banner />

  <div class="container grow">
    <div class="lg:col-span-7">
      <router-view />
    </div>
    <div class="py-10">
      <hr>
      <tron-link-helper />
      <hr>
    </div>
  </div>

  <the-footer />
</template>

<script>
import TheHeader from '@/components/TheHeader.vue';
import TheFooter from '@/components/TheFooter.vue';
import TheBanner from '@/components/TheBanner.vue';
import TronLinkHelper from './components/TronLinkHelper.vue';

export default {
  components: {
    TronLinkHelper,
    TheHeader,
    TheFooter,
    TheBanner
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

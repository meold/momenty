<template>
  <h1>Test</h1>

  <hr>
  <tron-link-helper />
  <hr>

  <ipfs-info />
</template>

<script>
import IpfsInfo from './components/IpfsInfo.vue';
import TronLinkHelper from './components/TronLinkHelper.vue';

export default {
  components: {
    IpfsInfo,
    TronLinkHelper
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

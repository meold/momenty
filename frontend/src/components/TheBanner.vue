<template>

  <div v-if="isVisible" class="container pb-4 sm:pb-10">
    <div class="p-2 banner-gradient shadow">
      <div class="flex items-center justify-between flex-wrap">
        <div class="w-0 flex-1 flex items-center">
          <p class="ml-3 font-medium truncate">
            <span>Congrats: New Platform for Photo+Video Moments as NFT Without Code</span>
          </p>
        </div>
        <div class="flex-shrink-0 mx-2">
          <button type="button" class="-mr-1 flex p-1 text-white hover:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/20" @click="hide">
            <span class="sr-only">Dismiss</span>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.70711 1.70711C10.0976 1.31659 10.0976 0.683425 9.70711 0.292901C9.31658 -0.0976235 8.68342 -0.0976235 8.29289 0.292901L9.70711 1.70711ZM0.292893 8.2929C-0.0976311 8.68343 -0.0976311 9.31659 0.292893 9.70712C0.683417 10.0976 1.31658 10.0976 1.70711 9.70712L0.292893 8.2929ZM1.70711 0.292901C1.31658 -0.0976235 0.683417 -0.0976235 0.292893 0.292901C-0.0976311 0.683425 -0.0976311 1.31659 0.292893 1.70711L1.70711 0.292901ZM8.29289 9.70712C8.68342 10.0976 9.31658 10.0976 9.70711 9.70712C10.0976 9.31659 10.0976 8.68343 9.70711 8.2929L8.29289 9.70712ZM8.29289 0.292901L0.292893 8.2929L1.70711 9.70712L9.70711 1.70711L8.29289 0.292901ZM0.292893 1.70711L8.29289 9.70712L9.70711 8.2929L1.70711 0.292901L0.292893 1.70711Z" fill="currentColor" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isVisible: true
    }
  },
  methods: {
    hide() {
      this.isVisible = false;
    }
  }
}
</script>

<style scoped>
.banner-gradient {
  background: linear-gradient(90deg, #FFFEFE 10.42%, #F07035 25%, #FFFEFD 42.19%, #FFFFFE 51.56%, #FF5E05 100%);
}
</style>
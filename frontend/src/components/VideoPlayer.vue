<template>
  <div class="video-container relative">
    <video ref="videoPlayer" muted loop playsinline preload="auto" class="w-full h-full object-cover" :src="videoUrl" :controls="controls" autoplay />

    <div v-if="isButtonShown" class="absolute inset-0 flex justify-center items-center z-1">
      <button class="bg-primary hover:opacity-80 rounded-md" @click.stop.prevent="onButtonClick">
        <div class="play" />
      </button>
    </div>
  </div>
</template>

<script>
export default {

  data() {
    return {
      controls: false,
      isButtonShown: false,
      player: null,
      videoUrl: window.location.origin + '/killme/vid.mov'
    };
  },

  methods: {

    onButtonClick() {
      this.isButtonShown = false;
      this.controls = true;
      this.$refs.videoPlayer.play();
    }

    // onWaypoint({ going }) {
    //   if (going == this.$waypointMap.GOING_OUT) {
    //     this.$refs.videoPlayer.pause();
    //   }
    // }
  }
};
</script>

<style scoped>
.play {
  content: '';
  margin: 10px;
  box-sizing: border-box;
  width: 20px;
  height: 20px;
  border-width: 10px 0px 10px 20px;
  border-color: transparent transparent transparent white;
}
</style>
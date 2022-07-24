<template>
  <div class="video-container relative">
    <video
      ref="videoPlayer"
      :key="key"
      :muted="!isUnmuted"
      loop
      playsinline
      disablepictureinpicture
      preload="metadata"
      class="w-full h-full object-cover"
      :src="src"
      :controls="controls"
      :autoplay="autoplay"
      @click="onClick"
    />
  </div>
</template>

<script>
export default {

  props:{
    play: {
      type: Boolean,
      default: false
    },
    src: {
      type: String,
      default: null
    },
    isUnmuted: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      key: 0,
      controls: false,
      autoplay: false,
      player: null
    };
  },

  watch: {
    async play(val) {
      if (val) {
        try {
          await this.$refs.videoPlayer.play();
        } catch (err) {
          this.autoplay = true;
          this.key++;
        }
        return;
      }
      this.$refs.videoPlayer.pause();
      this.$refs.videoPlayer.currentTime = 0;
    }
  },

  methods: {
    onClick(e) {
      if (!this.key) {
        return true;
      }
      e.stopPropagation();
    }
  }
};
</script>

<template>
  <div class="drop-zone p-4" @dragover="dragover" @dragleave="dragleave" @drop="drop">
    <slot />
    <input
      :id="$id('assetsFieldHandle')"
      ref="file"
      type="file"
      class="h-0 opacity-0 overflow-hidden position-absolute"
      :multiple="multiple"
      :accept="accept"
      @change="onChange"
    >
    <label class="d-block" :for="$id('assetsFieldHandle')">
      <div v-if="text" class="text-center">{{ text }}</div>
      <div v-if="text" class="row spacer my-3 mx-4">
        <div class="col"><hr></div>
        <div class="col-auto px-0 align-self-center text-muted">OR</div>
        <div class="col"><hr></div>
      </div>
      <div class="text-center"><div class="btn btn-outline-primary">Browse</div></div>
    </label>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: null
    },
    accept: {
      type: String,
      default: 'audio/*,video/*,image/*'
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },

  emits: [ 'change' ],

  methods: {
    dragover(event) {
      event.preventDefault();
      event.currentTarget.classList.add('active');
    },
    dragleave(event) {
      event.currentTarget.classList.remove('active');
    },
    drop(event) {
      event.preventDefault();
      this.$refs.file.files = event.dataTransfer.files;
      this.onChange();
      event.currentTarget.classList.remove('active');
    },
    onChange() {
      this.$emit('change', [...this.$refs.file.files]);
    },

    clear() {
      this.$refs.file.value = null;
    }
  }
};
</script>

<template>
  <label @dragover="dragover" @dragleave="dragleave" @drop="drop">
    <slot />
    <input
      ref="file"
      type="file"
      class="h-0 opacity-0 overflow-hidden absolute"
      :multiple="multiple"
      :accept="accept"
      @change="onChange"
    >
  </label>
</template>

<script>
export default {
  props: {
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

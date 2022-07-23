<template>
  <div class="relative pt-1">
    <div class="flex mb-2 items-center justify-center">
      <div>
        <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-white bg-primary bg-opacity-80">
          Uploading
        </span>
      </div>
    </div>
    <div class="overflow-hidden h-2 my-4 text-xs flex rounded bg-primary bg-opacity-20">
      <div :style="`width:${value}%`" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary" />
    </div>
    <div class="flex items-center justify-center">
      <span class="text-xs font-semibold inline-block text-primary">
        {{ value }}%
      </span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  value: {
    type: Number,
    default: 0
  }
});
</script>

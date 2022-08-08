<template>
  <div class="flex w-full">
    <div class="srink-0 grow-0 mr-14 hidden lg:block">
      <menu-vertical />
    </div>

    <div class="grow">
      <nft-list
        :key="section"
        :title="`${capitalize(section)} moments`"
        :url="`/nft/section/${section}/`"
      />
    </div>
  </div>
</template>

<script setup>
import MenuVertical from '@/components/MenuVertical.vue';
import NftList from '@/components/NftList.vue';

defineProps({
  section: {
    type: String,
    default: null
  }
});

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
</script>

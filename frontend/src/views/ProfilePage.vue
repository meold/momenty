<template>
  <div class="flex w-full">
    <div class="srink-0 grow-0 mr-14 hidden md:block">
      <menu-profile :user="user" />
    </div>
    <div class="grow">
      <h1 class="text-xl font-bold mb-2">
        User moments
      </h1>
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        <div v-for="slide in 30" :key="slide">
          <nft-card :nft="{}" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import MenuProfile from '@/components/MenuProfile.vue';
import NftCard from '@/components/NftCard.vue';
import { ref, watch } from 'vue';
import { get } from '@/useApi.js';

const props = defineProps({
  id: {
    type: [Number, String],
    default: null
  }
});

watch(
  () => props.id,
  val => {
    getUser(val)
  }
);

getUser(props.id);

const user = ref({});

async function getUser() {
  const { user: _user } = await get(`/user/${props.id}/`);
  user.value = _user;
}

</script>

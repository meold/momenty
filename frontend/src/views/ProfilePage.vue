<template>
  <div class="flex w-full">
    <div class="srink-0 grow-0 mr-14 hidden md:block">
      <menu-profile :user="user" />
    </div>
    <div class="grow">
      <nft-list
        v-if="id"
        :key="id"
        title="User moments"
        :url="`/nft/`"
        :url-options="{ authorId: id }"
      />
    </div>
  </div>
</template>

<script setup>
import MenuProfile from '@/components/MenuProfile.vue';
import NftList from '@/components/NftList.vue';
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
  () => {
    getUser();
  }
);

getUser();

const user = ref({});

async function getUser() {
  const { user: _user } = await get(`/user/${props.id}/`);
  user.value = _user;
}
</script>

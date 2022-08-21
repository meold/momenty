<template>
  <div class="flex w-full">
    <div class="srink-0 grow-0 mr-14 hidden md:block">
      <menu-profile :user="user" />
    </div>
    <div class="grow">
      <nft-list
        v-if="id"
        :key="id"
        :title="title"
        :url="`/nft/`"
        :url-options="urlOptions"
      />
    </div>
  </div>
</template>

<script setup>
import MenuProfile from '@/components/MenuProfile.vue';
import NftList from '@/components/NftList.vue';
import { ref, watch, computed } from 'vue';
import { get } from '@/useApi.js';
import { userState } from '@/useLogin';

const props = defineProps({
  id: {
    type: [Number, String],
    default: null
  }
});

const isCurrentUser = computed(() => userState.data?.id == props.id);
const title = computed(() => ( isCurrentUser.value ? 'Owned moments' : 'Created moments'));
const urlOptions = computed(() => ( isCurrentUser.value ? { userId: props.id } : { authorId: props.id }));

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

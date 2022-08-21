<template>
  <div>
    <div class="flex flex-row gap-x-20 max-w-5xl mx-auto">
      <div class="shrink-0 basis-1/3">
        <nft-card :nft="nft" />
      </div>

      <div v-if="isNftLoaded" class="grow">

        <div class="flex justify-between items-center" :class="isSold ? 'mb-1' : 'mb-8'">
          <user-card :user="nft.author" />
          <button-primary v-if="!isAuthor" class="!py-3">Follow</button-primary>
        </div>

        <div v-if="isSold" class="mb-8 flex justify-between items-center">
          <user-card :user="nft.user" prefix-text="owned by" />
        </div>

        <h1 class="font-display text-2xl leading-tight mb-4">
          {{ nft.title }}
        </h1>

        <p class="opacity-50 text-sm mb-8">
          {{ nft.description }}
        </p>

        <nft-sell v-if="isOwner" :nft="nft" />
        <nft-buy v-else :nft="nft" />
      </div>

      <div v-else class="grow flex justify-center items-center h-40">
        <spinner />
      </div>
    </div>

    <hr class="border border-gray-300 my-14">

    <nft-list
      v-if="isNftLoaded"
      title="Other author Moments"
      :url="`/nft/`"
      :url-options="{ authorId: nft.authorId }"
    />
  </div>
</template>

<script setup>
import NftBuy from '@/components/NftBuy.vue';
import NftSell from '@/components/NftSell.vue';
import NftCard from '@/components/NftCard.vue';
import UserCard from '@/components/UserCard.vue';
import Spinner from '@/components/Spinner.vue';
import ButtonPrimary from '@/components/ButtonPrimary.vue';
import { ref, watch, computed } from 'vue';
import { get } from '@/useApi.js';
import { userState } from '@/useLogin.js';
import NftList from '@/components/NftList.vue';

const props = defineProps({
  id: {
    type: [Number, String],
    default: null
  }
});

watch(
  () => props.id,
  val => {
    console.log('watch', val)
    getNft(val)
  },
  { immediate: true }
);

const isOwner = computed(() => nft.value?.userId == userState.data?.id);
const isAuthor = computed(() => nft.value?.authorId == userState.data?.id);
const isSold = computed(() => nft.value?.authorId != nft.value?.userId);

const nft = ref({});
const isNftLoaded = ref(false);

async function getNft() {

  console.log('get nft')

  const { nft: _nft } = await get(`/nft/${props.id}/`);
  nft.value = _nft;
  isNftLoaded.value = true;
}
</script>

<template>
  <form class="relative w-full max-w-md" @submit.prevent="submit">
    <div
      class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none text-gray-500"
      :class="search ? 'text-primary pointer-events-auto cursor-pointer' : null"
      @click="submit"
    >
      <svg aria-hidden="true" class="w-5 h-5 " fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
      </svg>
    </div>
    <input
      v-model="search"
      type="search"
      placeholder="Search by collection, NFT, username"
      class="w-full p-[13px] pl-10 border-2 rounded-xl border-gray-300 text-sm placeholder:text-gray-300"
    >
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const search = ref(null);

function submit() {
  router.push({ name: 'SearchPage', params: { search: search.value }});
  search.value = null;
}
</script>

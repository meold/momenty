<template>
  <popover v-slot="{ open }" class="relative">
    <popover-button
      v-bind="$attrs"
      class="flex items-center justify-center hover:shadow-inner hover:bg-slate-50 border-2 rounded-xl border-gray-300"
      :class="open ? 'text-primary' : 'text-black'"
    >
      <svg width="100%" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.1225 13.8776C15.3955 13.8776 14.7246 14.1327 14.1991 14.5587L8.91335 10.7347C9.00185 10.2489 9.00185 9.7511 8.91335 9.26531L14.1991 5.44133C14.7246 5.86735 15.3955 6.12245 16.1225 6.12245C17.8113 6.12245 19.1838 4.75 19.1838 3.06122C19.1838 1.37245 17.8113 0 16.1225 0C14.4338 0 13.0613 1.37245 13.0613 3.06122C13.0613 3.35714 13.1021 3.64031 13.1812 3.91071L8.16079 7.54592C7.4159 6.55867 6.23222 5.91837 4.89804 5.91837C2.64294 5.91837 0.816406 7.7449 0.816406 10C0.816406 12.2551 2.64294 14.0816 4.89804 14.0816C6.23222 14.0816 7.4159 13.4413 8.16079 12.4541L13.1812 16.0893C13.1021 16.3597 13.0613 16.6454 13.0613 16.9388C13.0613 18.6276 14.4338 20 16.1225 20C17.8113 20 19.1838 18.6276 19.1838 16.9388C19.1838 15.25 17.8113 13.8776 16.1225 13.8776ZM16.1225 1.73469C16.8547 1.73469 17.4491 2.32908 17.4491 3.06122C17.4491 3.79337 16.8547 4.38776 16.1225 4.38776C15.3904 4.38776 14.796 3.79337 14.796 3.06122C14.796 2.32908 15.3904 1.73469 16.1225 1.73469ZM4.89804 12.2449C3.66079 12.2449 2.65314 11.2372 2.65314 10C2.65314 8.76276 3.66079 7.7551 4.89804 7.7551C6.13528 7.7551 7.14294 8.76276 7.14294 10C7.14294 11.2372 6.13528 12.2449 4.89804 12.2449ZM16.1225 18.2653C15.3904 18.2653 14.796 17.6709 14.796 16.9388C14.796 16.2066 15.3904 15.6122 16.1225 15.6122C16.8547 15.6122 17.4491 16.2066 17.4491 16.9388C17.4491 17.6709 16.8547 18.2653 16.1225 18.2653Z" fill="currentColor" />
      </svg>
    </popover-button>

    <transition-root>
      <transition-child
        as="div"
        enter="duration-150 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-150 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <popover-overlay class="fixed inset-0" />
      </transition-child>

      <transition-child
        as="div"
        enter="duration-150 ease-out"
        enter-from="opacity-0 scale-95"
        enter-to="opacity-100 scale-100"
        leave="duration-100 ease-in"
        leave-from="opacity-100 scale-100"
        leave-to="opacity-0 scale-95"
        class="absolute right-0 left-0 md:left-auto min-w-[200px] top-full mt-4 flex origin-top flex-col rounded-2xl bg-white p-8 text-lg tracking-tight text-slate-900 shadow-xl ring-1 ring-slate-900/5 opacity-100 scale-100 z-[1]"
      >
        <popover-panel v-slot="{ close }">
          <div class="whitespace-nowrap">

            <copy-to-clipboard :text="href" class="flex items-center hover:text-primary cursor-pointer" @click="onClose(close)">
              <div class="ml-2">Copy link to clipboard</div>
            </copy-to-clipboard>

            <share-network
              tag="button"
              class="flex items-center hover:text-primary cursor-pointer"
              network="facebook"
              :url="href"
              :title="nft.title"
              :description="nft.description"
              :quote="nft.description"
              hashtags="momenty"
            >
              <svg class="w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path d="M400 32H48A48 48 0 0 0 0 80v352a48 48 0 0 0 48 48h137.25V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.27c-30.81 0-40.42 19.12-40.42 38.73V256h68.78l-11 71.69h-57.78V480H400a48 48 0 0 0 48-48V80a48 48 0 0 0-48-48z" fill="currentColor" />
              </svg>
              <div class="ml-2">Share on Facebook</div>
            </share-network>

            <share-network
              tag="button"
              class="flex items-center hover:text-primary cursor-pointer"
              network="twitter"
              :url="href"
              :title="nft.title"
              :description="nft.description"
              hashtags="momenty"
            >
              <svg class="w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-48.9 158.8c.2 2.8.2 5.7.2 8.5 0 86.7-66 186.6-186.6 186.6-37.2 0-71.7-10.8-100.7-29.4 5.3.6 10.4.8 15.8.8 30.7 0 58.9-10.4 81.4-28-28.8-.6-53-19.5-61.3-45.5 10.1 1.5 19.2 1.5 29.6-1.2-30-6.1-52.5-32.5-52.5-64.4v-.8c8.7 4.9 18.9 7.9 29.6 8.3a65.447 65.447 0 0 1-29.2-54.6c0-12.2 3.2-23.4 8.9-33.1 32.3 39.8 80.8 65.8 135.2 68.6-9.3-44.5 24-80.6 64-80.6 18.9 0 35.9 7.9 47.9 20.7 14.8-2.8 29-8.3 41.6-15.8-4.9 15.2-15.2 28-28.8 36.1 13.2-1.4 26-5.1 37.8-10.2-8.9 13.1-20.1 24.7-32.9 34z" fill="currentColor" />
              </svg>
              <div class="ml-2">Share on Twitter</div>
            </share-network>

            <share-network
              tag="button"
              class="flex items-center hover:text-primary cursor-pointer"
              network="telegram"
              :url="href"
              :title="nft.title"
              :description="nft.description"
              hashtags="momenty"
            >
              <svg class="w-5 h-[19px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path d="M248,8C111.033,8,0,119.033,0,256S111.033,504,248,504,496,392.967,496,256,384.967,8,248,8ZM362.952,176.66c-3.732,39.215-19.881,134.378-28.1,178.3-3.476,18.584-10.322,24.816-16.948,25.425-14.4,1.326-25.338-9.517-39.287-18.661-21.827-14.308-34.158-23.215-55.346-37.177-24.485-16.135-8.612-25,5.342-39.5,3.652-3.793,67.107-61.51,68.335-66.746.153-.655.3-3.1-1.154-4.384s-3.59-.849-5.135-.5q-3.283.746-104.608,69.142-14.845,10.194-26.894,9.934c-8.855-.191-25.888-5.006-38.551-9.123-15.531-5.048-27.875-7.717-26.8-16.291q.84-6.7,18.45-13.7,108.446-47.248,144.628-62.3c68.872-28.647,83.183-33.623,92.511-33.789,2.052-.034,6.639.474,9.61,2.885a10.452,10.452,0,0,1,3.53,6.716A43.765,43.765,0,0,1,362.952,176.66Z" fill="currentColor" />
              </svg>
              <div class="ml-2">Send by Telegram</div>
            </share-network>

          </div>
        </popover-panel>
      </transition-child>
    </transition-root>
  </popover>
</template>

<script>
export default {
  inheritAttrs: false
}
</script>

<script setup>
import { Popover, PopoverButton, PopoverOverlay, PopoverPanel, TransitionRoot, TransitionChild } from '@headlessui/vue';
import CopyToClipboard from './CopyToClipboard.vue';
import { ShareNetwork } from 'vue-social-sharing';

const props = defineProps({
  nft: {
    type: Object,
    default: () => ({})
  }
});

const href = `${window.location.origin}/view/${props.nft.id}`;

function onClose(close) {
  setTimeout(close, 200);
}
</script>

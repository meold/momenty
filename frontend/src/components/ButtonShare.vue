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

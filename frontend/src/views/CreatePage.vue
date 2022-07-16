<template>
  <div>
    <h1 class="font-display text-2xl leading-tight mb-10">
      Create or sell your NFT
    </h1>
    <form-kit ref="form" v-model="nft" :actions="false" type="form" autocomplete="off" @submit="submit">
      <div class="flex flex-row gap-x-10">
        <div class="shrink-0 basis-2/12">
          <h2 class="text-xl text-center font-bold mb-2">Add video</h2>
          <nft-card-container>
            <drop-area />
          </nft-card-container>
        </div>
        <div class="shrink-0 basis-2/12">
          <h2 class="text-xl text-center font-bold mb-2">Add video</h2>
          <nft-card-container>
            <drop-area />
          </nft-card-container>
        </div>
        <div class="grow">
          <form-kit-schema :schema="schema" />
        </div>
        <div class="shrink-0 basis-2/12">
          <p class="opacity-50 text-sm mb-10">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea rem velit voluptatem, voluptas rerum illo saepe eos? Soluta quia numquam velit neque ducimus, fuga magni fugiat repellendus architecto possimus voluptates.
          </p>
          <div>
            <button-secondary class="w-full py-3 mb-2">
              Create
              <span class="ml-2">+</span>
            </button-secondary>
          </div>
          <div>
            <button-primary class="w-full py-3">
              Sell
            </button-primary>
          </div>
        </div>
      </div>
    </form-kit>
  </div>
</template>

<script setup>
import NftCardContainer from '@/components/NftCardContainer.vue';
import ButtonPrimary from '@/components/ButtonPrimary.vue';
import ButtonSecondary from '@/components/ButtonSecondary.vue';
import DropArea from '@/components/DropArea.vue';
import { ref } from 'vue';

const form = ref(null);
const nft = ref({});

const schema = [
  {
    $formkit: 'text',
    name: 'title',
    label: 'Title',
    classes: {
      label: 'text-xl font-bold mb-2',
      input: 'placeholder:text-sm placeholder:opacity-30 placeholder:text-black w-full',
      outer: 'relative',
      messages: 'absolute right-0'
    },
    // labelClass: 'text-xl font-bold mb-2',
    placeholder: 'Enter title (maximum 120 symbols)',
    validation: 'required|length:1,120',
    validationVisibility: 'blur'
  },
  {
    $el: 'h2',
    attrs: {
      class: 'text-xl font-bold mb-2'
    },
    children: 'Description'
  },
  {
    $el: 'div',
    attrs: {
      class: 'text-xs opacity-50 leading-normal mb-3'
    },
    children: 'OpenSea will include a link to this URL on this item\'s detail page, so that users can click to learn more about it. You are welcome to link to your own webpage with more details.'
  },
  {
    $formkit: 'textarea',
    name: 'description',
    classes: {
      input: 'placeholder:text-sm placeholder:opacity-30 placeholder:text-black w-full',
      outer: 'relative',
      messages: 'absolute right-0'
    },
    placeholder: 'Enter description (maximum 400 symbols)',
    validation: 'required|length:1,400',
    validationVisibility: 'blur'
  }
];

function submit() {

}
</script>


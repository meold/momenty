<template>
  <div>
    <h1 class="font-display text-2xl leading-tight mb-10">
      Create your NFT
    </h1>
    <form-kit ref="form" v-model="nft" :actions="false" type="form" autocomplete="off" message-class="text-right" @submit="submit">
      <div class="flex flex-row gap-x-10">

        <div class="shrink-0 basis-2/12">
          <h2 class="text-xl text-center font-bold mb-2">Add image</h2>
          <nft-card-container :class="{ 'border-2 border-red-500': isImageInvalid }">
            <div v-if="nft.image?.length" class="w-full h-full flex justify-center items-center">
              <div class="w-full text-center">
                <div class="mx-3 font-semibold">Image:</div>
                <div class="m-3 text-xs truncate">
                  {{ nft.image[0].name }}
                </div>
                <button class="text-primary underline hover:opacity:80" @click="nft.image = []">Remove</button>
              </div>
            </div>
            <drop-area v-else accept="image/*" @change="onImageChange">
              <div class="hidden lg:block xl:hidden">
                <div>5 mb, JPG, PNG</div>
                <div>1080px x 1920px</div>
                <div>9:16</div>
                <div>&nbsp;</div>
              </div>
              <div class="hidden xl:block">
                <div>Max size 5 mb, JPG, PNG</div>
                <div>Dimensions 1080px x 1920px</div>
                <div>Aspect ratio 9:16</div>
                <div>&nbsp;</div>
              </div>
            </drop-area>
          </nft-card-container>
          <div v-if="isImageInvalid" class="text-red-500 mb-1 text-xs text-right mt-2">Image is required</div>
        </div>

        <div class="shrink-0 basis-2/12">
          <h2 class="text-xl text-center font-bold mb-2">Add video</h2>


          <example-media-upload @image="imageAttached" @video="videoAttached" />
          <nft-card-container :class="{ 'border-2 border-red-500': isVideoInvalid }">
            <div v-if="nft.video?.length" class="w-full h-full flex justify-center items-center">
              <div class="w-full text-center">
                <div class="mx-3 font-semibold">Video:</div>
                <div class="m-3 text-xs truncate">
                  {{ nft.video[0].name }}
                </div>
                <button class="text-primary underline hover:opacity:80" @click="nft.video = []">Remove</button>
              </div>
            </div>
            <drop-area v-else accept="video/*" @change="onVideoChange">
              <div class="hidden lg:block xl:hidden">
                <div>15 sec</div>
                <div>25 mb, MOV, MP4</div>
                <div>1080px x 1920px</div>
                <div>9:16</div>
              </div>
              <div class="hidden xl:block">
                <div>Max duration 15 sec</div>
                <div>Max size 25 mb, MOV, MP4</div>
                <div>Dimensions 1080px x 1920px</div>
                <div>Aspect ratio 9:16</div>
              </div>
            </drop-area>
          </nft-card-container>
          <div v-if="isVideoInvalid" class="text-red-500 mb-1 text-xs text-right mt-2">Video is required</div>
        </div>

        <div class="grow">
          <form-kit-schema :schema="schema" />
        </div>

        <div class="shrink-0 basis-2/12">
          <p class="opacity-50 text-sm mb-10">
            Once you're done customizing your image, video and description, click Create button. Congrats, you've just create your NFT moment!
          </p>
          <div>
            <FormKit
              type="submit"
              label="Create"
              input-class="w-full !py-3"
            />
          </div>
        </div>
      </div>
    </form-kit>
  </div>
</template>

<script setup>
import NftCardContainer from '@/components/NftCardContainer.vue';
import DropArea from '@/components/DropArea.vue';
import ExampleMediaUpload from '@/components/ExampleMediaUpload.vue';
import { ref, computed } from 'vue';
import { post } from 'axios';
import sections from '@/../../common/sections.mjs';

const form = ref(null);
const nft = ref({});

const isImageInvalid = computed(() => (
  form.value?.node?.children[0]?.context?.state?.dirty &&
  !form.value?.node?.children[0]?.context?.state?.valid
));

const isVideoInvalid = computed(() => (
  form.value?.node?.children[1]?.context?.state?.dirty &&
  !form.value?.node?.children[1]?.context?.state?.valid
));

const schema = [
  // NOTE: image and video must be in this order becuase of computed
  {
    $formkit: 'file',
    name: 'image',
    accept: 'image/*',
    outerClass: 'h-0 opacity-0 overflow-hidden absolute',
    validation: 'required',
    validationVisibility: 'dirty'
  },
  {
    $formkit: 'file',
    name: 'video',
    accept: 'video/*',
    outerClass: 'h-0 opacity-0 overflow-hidden absolute',
    validation: 'required',
    validationVisibility: 'dirty'
  },
  {
    $formkit: 'text',
    name: 'title',
    label: 'Title',
    classes: {
      label: 'text-xl font-bold mb-2',
      input: 'w-full',
      outer: 'relative',
      messages: 'absolute right-0'
    },
    // labelClass: 'text-xl font-bold mb-2',
    placeholder: 'Enter title (maximum 120 symbols)',
    validation: 'required|length:1,120',
    validationVisibility: 'dirty'
  },
  {
    $formkit: 'select',
    name: 'section',
    label: 'Topic',
    options: sections,
    classes: {
      label: 'text-xl font-bold mb-2',
      input: 'w-full capitalize',
      outer: 'relative',
      messages: 'absolute right-0'
    },
    placeholder: 'Please select one',
    validation: 'required',
    validationVisibility: 'dirty'
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
    children: 'The description will be included on the NFT moment\'s detail page underneath its image and video'
  },
  {
    $formkit: 'textarea',
    name: 'description',
    classes: {
      input: 'w-full',
      outer: 'relative',
      messages: 'absolute right-0'
    },
    placeholder: 'Enter description (maximum 400 symbols)',
    validation: 'required|length:1,400',
    validationVisibility: 'dirty'
  }
];

function onVideoChange(event) {
  if (event[0]?.type?.split('/')[0] !== 'video') {
    nft.value.video = [];
    return;
  }
  nft.value.video = event;
}

function onImageChange(event) {
  if (event[0]?.type?.split('/')[0] !== 'image') {
    nft.value.image = [];
    return;
  }
  nft.value.image = event;
}

async function submit(data) {
  const url = '/api/nft/';
  const config = {
    headers: {
      'content-type': 'multipart/form-data'
    }
  };

  const result = await post(url, data, config);
  console.log(result);
}

async function imageAttached(imageId) {
  console.log('Done image', imageId);
}

async function videoAttached(videoId) {
  console.log('Done video', videoId);
}
</script>

<style lang="scss">
select.formkit-input[data-placeholder] {
  @apply text-gray-300 text-sm;
}
</style>
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
            <div v-if="nft.image" class="relative w-full h-full flex justify-center items-center">
              <img :src="nft.image" class="w-full h-full object-cover" alt="">
              <button class="absolute top-4 right-4 text-white bg-primary p-2 rounded-xl shadow hover:opacity:80" @click="nft.image = null">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            <div v-else-if="isImageLoading" class="w-full h-full flex justify-center items-center">
              <progress-bar :value="progress" class="text-primary" />
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

          <nft-card-container :class="{ 'border-2 border-red-500': isVideoInvalid }">

            <div v-if="nft.video" class="w-full h-full flex justify-center items-center">
              <video
                :src="nft.video"
                class="w-full h-full object-cover"
                muted
                loop
                playsinline
                disablepictureinpicture
                preload="metadata"
              />
              <button class="absolute top-4 right-4 text-white bg-primary p-2 rounded-xl shadow hover:opacity:80" @click="nft.video = null">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            <div v-else-if="isVideoLoading" class="w-full h-full flex justify-center items-center">
              <progress-bar :value="progress" class="text-primary" />
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

    <ui-dialog :show="!userState.isLogged">
      <ui-dialog-panel>
        <ui-dialog-title>
          Attention!
        </ui-dialog-title>
        Your wallet is disconnected. You must connect your wallet to create moment!
        <div class="mt-5 flex justify-end">
          <button-wallet />
        </div>
      </ui-dialog-panel>
    </ui-dialog>
  </div>
</template>

<script setup>
import UiDialog from '@/components/ui/UiDialog.vue';
import UiDialogTitle from '@/components/ui/UiDialogTitle.vue';
import UiDialogPanel from '@/components/ui/UiDialogPanel.vue';
import ButtonWallet from '@/components/ButtonWallet.vue';
import NftCardContainer from '@/components/NftCardContainer.vue';
import DropArea from '@/components/DropArea.vue';
import ProgressBar from '@/components/ProgressBar.vue';
import { ref, computed } from 'vue';
import { post } from '@/useApi.js';
import sections from '@/../../common/sections.mjs';
import { error } from '@/notify.js';
import { useRouter } from 'vue-router';
import { userState } from '@/useLogin.js';

const router = useRouter();

if (!userState.isLogged) {
  router.push('/register');
}

const S3prefix = 'https://main-momenty-incoming-media.s3.eu-central-1.amazonaws.com/';

const form = ref(null);
const nft = ref({});
const isImageLoading = ref(false);
const isVideoLoading = ref(false);
const progress = ref(0);



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
    $formkit: 'hidden',
    name: 'image',
    validation: 'required'
  },
  {
    $formkit: 'hidden',
    name: 'video',
    accept: 'video/*',
    validation: 'required'
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
    validation: 'length:0,400',
    validationVisibility: 'dirty'
  }
];

async function onVideoChange(event) {
  const file = event[0];
  if (!file || !file.type.startsWith('video/')) {
    nft.value.video = null;
    return;
  }

  isVideoLoading.value = true;
  const videoId = await uploadMedia({ file, type: 'video' });
  isVideoLoading.value = false;
  progress.value = 0;
  if (!videoId) {
    nft.value.video = null;
    return;
  }

  //NOTE url to file will be https://main-momenty-incoming-media.s3.eu-central-1.amazonaws.com/{{videoId}}
  nft.value.video = S3prefix + videoId;
}

async function onImageChange(event) {
  const file = event[0];
  if (!file || !file.type.startsWith('image/')) {
    nft.value.image = null;
    return;
  }
  isImageLoading.value = true;
  const imageId = await uploadMedia({ file, type: 'image' });
  isImageLoading.value = false;
  progress.value = 0;
  if (!imageId) {
    nft.value.image = null;
    return;
  }

  //NOTE url to file will be https://main-momenty-incoming-media.s3.eu-central-1.amazonaws.com/{{imageId}}
  nft.value.image = S3prefix + imageId;
}

async function submit(data) {
  const url = '/nft/';
  const { success, id } = await post(url, data);
  if (success) {
    router.push(`/view/${id}`);
  }
}

function uploadMedia({ file, type }) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async resolve => {

    const postUrl = '/sign-media-upload/' + type + '/'

    const arr = file.name.split('.');
    const extension = arr[arr.length - 1];

    // Random image UUID and signed upload URL
    const { success, id, url } = await post(postUrl, {
      extension
    });
    console.log(file);

    if (!success) {
      error('Cannot upload media.');
      resolve();
      return;
    }

    const xhr = new XMLHttpRequest();

    xhr.open('PUT', url);

    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) {
        return;
      }

      if (xhr.status === 200 || xhr.status === 204) {
        console.log('uploaded');
        resolve(id + '.' + extension);
        return;
      }

      console.log('failed', xhr);
      resolve();
    };

    xhr.upload.onprogress = event => {
      if (event.lengthComputable) {
        console.log('onProgress ', event.loaded, event.total)
        progress.value = parseInt(100 * event.loaded / event.total, 10);
      }
    };

    xhr.send(file);
  });
}

</script>

<style lang="scss">
select.formkit-input[data-placeholder] {
  @apply text-gray-300 text-sm;
}
</style>
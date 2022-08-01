<template>
  <drop-zone class="relative inline-block" accept="image/*" @change="onChange">
    <div class="w-32 h-32 inline-block rounded-full border-2 border-primary hover:border-primary/80 overflow-hidden">
      <div v-if="url" class="relative w-full h-full flex justify-center items-center">
        <img :src="url" class="w-full h-full object-cover" alt="">
      </div>

      <div v-else-if="isImageLoading" class="w-full h-full flex justify-center items-center">
        <progress-bar :value="progress" class="text-primary" />
      </div>

      <div v-else class="w-full h-full flex justify-center items-center cursor-pointer">
        +
      </div>
    </div>

    <button v-if="url" class="absolute -top-4 -right-4 text-black/50 hover:text-primary p-2 hover:opacity:80" @click.prevent="setUrl(null)">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  </drop-zone>
</template>

<script setup>
import DropZone from '@/components/DropZone.vue';
import ProgressBar from '@/components/ProgressBar.vue';
import { ref } from 'vue';
import { post } from '@/useApi.js';
import { error } from '@/notify.js';

const S3prefix = 'https://main-momenty-incoming-media.s3.eu-central-1.amazonaws.com/';

defineProps({
  url: {
    type: String,
    default: null
  }
})

const emit = defineEmits([ 'update:url' ]);

const isImageLoading = ref(false);
const progress = ref(0);

function setUrl(val) {
  emit('update:url', val);
}

async function onChange(event) {
  const file = event[0];
  if (!file || !file.type.startsWith('image/')) {
    setUrl(null);
    return;
  }
  isImageLoading.value = true;
  const imageId = await uploadMedia({ file, type: 'image' });
  isImageLoading.value = false;
  progress.value = 0;
  if (!imageId) {
    setUrl(null);
    return;
  }

  //NOTE url to file will be https://main-momenty-incoming-media.s3.eu-central-1.amazonaws.com/{{imageId}}
  setUrl(S3prefix + imageId);
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

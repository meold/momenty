<template>
  <div class="file-input">
    <label role="button" for="$id('file-upload')">
      <slot>UPLOAD</slot>
    </label>
    <input type="file" ref="file" id="$id('file-upload')" class="d-none" multiple="false" @change="onFileAdded" :accept="accept">
  </div>
</template>

<script>
import { post } from 'axios';

export default {
  emits: [ 'upload-started', 'upload-finished', 'image', 'video' ],

  data() {
    return {
      accept: 'video/*,image/*'
    };
  },

  methods: {
    async onFileAdded(event) {
      const files = event.target.files;

      const file = files[0];

      if (file.type.startsWith('image/')) {
        this.$emit('upload-started');

        const imageId = await this.uploadMedia({ file, type: 'image' });
        if (imageId) {
          //NOTE url to file will be https://main-nftmoments-incoming-media.s3.eu-central-1.amazonaws.com/{{imageId}}
          this.$emit('image', imageId);
        }

        this.$emit('upload-finished');
      }

      if (file.type.startsWith('video/')) {
        this.$emit('upload-started');

        const videoId = await this.uploadMedia({ file, type: 'video' });
        if (videoId) {
          //NOTE url to file will be https://main-nftmoments-incoming-media.s3.eu-central-1.amazonaws.com/{{videoId}}
          this.$emit('video', videoId);
        }

        this.$emit('upload-finished');
      }
    },

    uploadMedia({ file, type }) {
      return new Promise(async resolve => {

        const postUrl = '/api/sign-media-upload/' + type + '/'

        const arr = file.name.split('.');
        const extension =  arr[arr.length - 1];

        const result = await post(postUrl, {
          extension
        });
        console.log(result, file);

        if (!result.data?.success) {
          this.$notify.error('Cannot upload media.');
          resolve();
          return;
        }

        // Random image UUID and signed upload URL
        const { id, url } = result.data;

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
          }
        };

        xhr.send(file);
      });
    }
  }
};
</script>

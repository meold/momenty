<template>
  <svg width="381" height="400" viewBox="0 0 381 400" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <path d="M302.604 55.5866L0.537598 0L159.505 400L381 130.143L302.604 55.5866ZM297.743 80.0795L343.949 123.996L217.569 146.882L297.743 80.0795ZM190.126 142.305L56.9185 31.8313L274.631 71.8899L190.126 142.305ZM180.631 161.842L158.919 341.406L41.8067 46.6973L180.631 161.842ZM200.736 171.375L340.677 146.031L180.158 341.595L200.736 171.375Z" fill="url(#paint0_linear)" />
    <mask id="mask0" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="180" y="146" width="161" height="196">
      <path d="M200.738 171.372L340.683 146.023L180.154 341.623L200.738 171.372Z" fill="#D9D9D9" />
    </mask>
    <g mask="url(#mask0)">
      <rect x="216.207" y="90.9348" width="146.539" height="260.513" transform="rotate(22.0818 216.207 90.9348)" fill="url(#pattern0)" />
    </g>
    <mask id="mask1" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="41" y="46" width="140" height="296">
      <path d="M41.719 46.6028L180.658 161.831L158.926 341.466L41.719 46.6028Z" fill="#D9D9D9" />
    </mask>
    <g mask="url(#mask1)">
      <rect x="-29.3293" y="66.8777" width="189.396" height="336.704" transform="rotate(-22.3783 -29.3293 66.8777)" fill="url(#pattern1)" />
    </g>
    <mask id="mask2" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="56" y="31" width="219" height="112">
      <path d="M56.8494 31.8036L274.958 71.834L190.168 142.363L56.8494 31.8036Z" fill="#D9D9D9" />
    </mask>
    <g mask="url(#mask2)">
      <rect x="23.0891" y="128.614" width="147.008" height="261.347" transform="rotate(-76.7235 23.0891 128.614)" fill="url(#pattern2)" />
    </g>
    <mask id="mask3" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="217" y="79" width="128" height="69">
      <path d="M297.757 79.929L344.366 124.123L217.3 147.062L297.757 79.929Z" fill="#D9D9D9" />
    </mask>
    <g mask="url(#mask3)">
      <rect x="340.488" y="61.806" width="87.0652" height="154.783" transform="rotate(75.3047 340.488 61.806)" fill="url(#pattern3)" />
    </g>
    <defs>
      <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
        <use xlink:href="#image0" transform="translate(-0.685185) scale(0.00350647 0.00197239)" />
      </pattern>
      <pattern id="pattern1" patternContentUnits="objectBoundingBox" width="1" height="1">
        <use xlink:href="#image1" transform="translate(-0.832344) scale(0.00395942 0.00222717)" />
      </pattern>
      <pattern id="pattern2" patternContentUnits="objectBoundingBox" width="1" height="1">
        <use xlink:href="#image2" transform="translate(-0.83206) scale(0.00509392 0.00286533)" />
      </pattern>
      <pattern id="pattern3" patternContentUnits="objectBoundingBox" width="1" height="1">
        <use xlink:href="#image3" transform="translate(-0.832344) scale(0.00395942 0.00222717)" />
      </pattern>
      <linearGradient id="paint0_linear" x1="-23.4151" y1="199.999" x2="415.067" y2="199.999" gradientUnits="userSpaceOnUse">
        <stop stop-color="#EB0029" />
        <stop offset="1" stop-color="#EB0029" stop-opacity="0" />
      </linearGradient>
      <transition name="slowfade" mode="out-in" appear>
        <image id="image0" :key="keys[0]" :class="classes[0]" width="676" height="507" :xlink:href="images[0]" />
      </transition>
      <transition name="slowfade" mode="out-in" appear>
        <image id="image1" :key="keys[1]" :class="classes[1]" width="673" height="449" :xlink:href="images[1]" />
      </transition>
      <transition name="slowfade" mode="out-in" appear>
        <image id="image2" :key="keys[2]" :class="classes[2]" width="523" height="349" :xlink:href="images[2]" />
      </transition>
      <transition name="slowfade" mode="out-in" appear>
        <image id="image3" :key="keys[3]" :class="classes[3]" width="673" height="449" :xlink:href="images[3]" />
      </transition>
    </defs>
  </svg>
</template>

<script>
export default {
  data() {
    return {
      nonce: 4,
      previous: 0,
      interval: null,
      keys: [0, 1, 2, 3],
      classes: ['opacity-80', 'opacity-90', 'opacity-100', 'opacity-75'],
      images: [
        'https://picsum.photos/200/300?1',
        'https://picsum.photos/200/300?2',
        'https://picsum.photos/200/300?3',
        'https://picsum.photos/200/300?4'
      ]
    };
  },
  mounted() {
    this.interval = setInterval(() => {
      let rand;
      do {
        rand = Math.floor(Math.random() * 4)
      } while (rand === this.previous);

      this.nonce++;
      this.previous = rand;
      this.images[rand] = `https://picsum.photos/200/300?${this.nonce}`;
      this.keys[rand] = this.nonce;
    }, 6000);
  },
  beforeUnmount() {
    clearInterval(this.interval);
  }
};
</script>

<style>
.slowfade-enter-active,
.slowfade-leave-active {
  opacity: 1;
  transition-property: opacity;
  transition-timing-function: ease;
}

.slowfade-enter-active {
  transition-duration: 3s;
}

.slowfade-leave-active {
  transition-duration: 1s;
}

.slowfade-enter,
.slowfade-leave-active {
  opacity: 0;
}
</style>
<template>
  <div class="w-96 relative">
    <img src="/near.png" alt="">
  </div>
</template>


<style>
.image {
  width: 58px;
  height: 58px;
  @apply absolute skew-y-12 rounded-lg overflow-hidden shadow;
}
.image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.cube-1 {
  position: absolute;
  top: 56px;
  left: 45px;
}
.cube-2 {
  position: absolute;
  top: 155px;
  left: 217px;
}
.image-1 {
  top: 0px;
  left: 31px;
  transform: scalex(1.5) scaleY(0.85) rotate(45deg);
}
.image-2 {
  top: 52px;
  left: 0px;
  transform: skewY(30deg);
}
.image-3 {
  top: 52px;
  left: 63px;
  transform: skewY(-30deg);
}


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

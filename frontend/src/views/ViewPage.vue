<template>
  <div>
    <div class="flex flex-row gap-x-20 max-w-5xl mx-auto">
      <div class="shrink-0 basis-1/3 max-w-[240px]">
        <nft-card />
      </div>
      <div class="grow">

        <router-link class="inline-block mb-8" to="/profile">
          <user-card />
        </router-link>

        <h1 class="font-display text-2xl leading-tight mb-4">
          Silent Ocean NFT with dark purple color background
        </h1>

        <p class="opacity-50 text-sm mb-8">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea rem velit voluptatem, voluptas rerum illo saepe eos? Soluta quia numquam velit neque ducimus, fuga magni fugiat repellendus architecto possimus voluptates.
        </p>

        <div class="mb-3">
          Current price
        </div>

        <div class="font-bold text-2xl mb-5">
          0.01 ETH
        </div>

        <div class="flex gap-x-3">
          <button-primary class="py-3">
            Buy NFT
          </button-primary>
          <button-secondary class="!p-3">
            <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.8376 2.125C16.3836 2.12454 16.9243 2.2331 17.4278 2.44431C17.9314 2.65552 18.3877 2.96514 18.7701 3.355C19.5579 4.15479 19.9995 5.23237 19.9995 6.355C19.9995 7.47764 19.5579 8.55522 18.7701 9.355L11.0001 17.2225L3.23008 9.355C2.44226 8.55522 2.00067 7.47764 2.00067 6.355C2.00067 5.23237 2.44226 4.15479 3.23008 3.355C3.61264 2.96542 4.06901 2.65596 4.57251 2.44472C5.07601 2.23348 5.61656 2.12468 6.16258 2.12468C6.70859 2.12468 7.24914 2.23348 7.75264 2.44472C8.25614 2.65596 8.71251 2.96542 9.09508 3.355L11.0001 5.305L12.8976 3.37C13.2788 2.97549 13.7356 2.6619 14.2407 2.44798C14.7459 2.23406 15.289 2.12421 15.8376 2.125ZM15.8376 0.625002C15.0918 0.62437 14.3534 0.772643 13.6657 1.06113C12.9779 1.34961 12.3547 1.7725 11.8326 2.305L11.0001 3.145L10.1676 2.305C9.64479 1.77346 9.02142 1.35131 8.33382 1.06314C7.64621 0.774981 6.90812 0.626573 6.16258 0.626573C5.41703 0.626573 4.67894 0.774981 3.99133 1.06314C3.30373 1.35131 2.68036 1.77346 2.15758 2.305C1.09398 3.38772 0.498047 4.84477 0.498047 6.3625C0.498047 7.88023 1.09398 9.33728 2.15758 10.42L11.0001 19.375L19.8426 10.42C20.9062 9.33728 21.5021 7.88023 21.5021 6.3625C21.5021 4.84477 20.9062 3.38772 19.8426 2.305C19.3199 1.77318 18.6966 1.35073 18.009 1.0623C17.3214 0.773862 16.5832 0.625207 15.8376 0.625002Z" fill="currentColor" />
            </svg>
          </button-secondary>
          <button-secondary class="!p-3">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.1225 13.8776C15.3955 13.8776 14.7246 14.1327 14.1991 14.5587L8.91335 10.7347C9.00185 10.2489 9.00185 9.7511 8.91335 9.26531L14.1991 5.44133C14.7246 5.86735 15.3955 6.12245 16.1225 6.12245C17.8113 6.12245 19.1838 4.75 19.1838 3.06122C19.1838 1.37245 17.8113 0 16.1225 0C14.4338 0 13.0613 1.37245 13.0613 3.06122C13.0613 3.35714 13.1021 3.64031 13.1812 3.91071L8.16079 7.54592C7.4159 6.55867 6.23222 5.91837 4.89804 5.91837C2.64294 5.91837 0.816406 7.7449 0.816406 10C0.816406 12.2551 2.64294 14.0816 4.89804 14.0816C6.23222 14.0816 7.4159 13.4413 8.16079 12.4541L13.1812 16.0893C13.1021 16.3597 13.0613 16.6454 13.0613 16.9388C13.0613 18.6276 14.4338 20 16.1225 20C17.8113 20 19.1838 18.6276 19.1838 16.9388C19.1838 15.25 17.8113 13.8776 16.1225 13.8776ZM16.1225 1.73469C16.8547 1.73469 17.4491 2.32908 17.4491 3.06122C17.4491 3.79337 16.8547 4.38776 16.1225 4.38776C15.3904 4.38776 14.796 3.79337 14.796 3.06122C14.796 2.32908 15.3904 1.73469 16.1225 1.73469ZM4.89804 12.2449C3.66079 12.2449 2.65314 11.2372 2.65314 10C2.65314 8.76276 3.66079 7.7551 4.89804 7.7551C6.13528 7.7551 7.14294 8.76276 7.14294 10C7.14294 11.2372 6.13528 12.2449 4.89804 12.2449ZM16.1225 18.2653C15.3904 18.2653 14.796 17.6709 14.796 16.9388C14.796 16.2066 15.3904 15.6122 16.1225 15.6122C16.8547 15.6122 17.4491 16.2066 17.4491 16.9388C17.4491 17.6709 16.8547 18.2653 16.1225 18.2653Z" fill="currentColor" />
            </svg>
          </button-secondary>
        </div>
      </div>
    </div>

    <hr class="border border-gray-300 my-14">

    <h2 class="text-xl font-bold mt-14 -mb-5">Other author NFT</h2>
    <carousel />
  </div>
</template>

<script setup>
import NftCard from '@/components/NftCard.vue';
import UserCard from '@/components/UserCard.vue';
import Carousel from '@/components/Carousel.vue';
import ButtonPrimary from '@/components/ButtonPrimary.vue';
import ButtonSecondary from '@/components/ButtonSecondary.vue';

</script>
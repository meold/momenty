<template>
  <header class="py-7">
    <div class="container">
      <nav class="relative flex items-center justify-between gap-x-5 md:gap-x-8">
        <div class="flex grow items-center md:gap-x-12">
          <router-link to="/" aria-label="Home" class="shrink-0 text-primary hover:opacity-80">
            <the-logo class="h-5" />
          </router-link>
          <div class="grow hidden md:flex justify-center">
            <div class="relative w-full max-w-md">
              <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" /></svg>
              </div>
              <input type="search" placeholder="Search by collection, NFT, username" class="w-full p-[13px] pl-10 border-2 rounded-xl border-gray-300 text-sm placeholder:text-gray-300">
            </div>
          </div>
        </div>
        <div class="flex shrink-0 items-center gap-x-5 md:gap-x-8">
          <router-link v-slot="{ navigate }" to="/new" custom>
            <button-secondary class="hidden md:block" @click="navigate" @keypress.enter="navigate">
              Create
              <span class="ml-2">+</span>
            </button-secondary>
          </router-link>

          <button-wallet />

          <div class="-mr-1">
            <popover v-slot="{ open }">
              <popover-button
                class="relative flex h-8 w-8 items-center justify-center [&:not(:focus-visible)]:focus:outline-none"
                aria-label="Toggle Navigation"
              >
                <svg
                  aria-hidden="true"
                  class="h-3.5 w-3.5 overflow-visible stroke-slate-700"
                  fill="none"
                  stroke-width="2"
                  strokeLinecap="round"
                >
                  <path
                    d="M0 1H14M0 7H14M0 13H14"
                    class="origin-center transition"
                    :class="open ? 'scale-90 opacity-0' : ''"
                  />
                  <path
                    d="M2 2L12 12M12 2L2 12"
                    class="origin-center transition"
                    :class="!open ? 'scale-90 opacity-0' : ''"
                  />
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
                  <popover-overlay class="fixed inset-0 bg-slate-600/5" />
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
                  <popover-panel>
                    <router-link to="/">
                      <popover-button as="div" class="menu-link">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12.4697 13.5303C12.7626 13.8232 13.2374 13.8232 13.5303 13.5303C13.8232 13.2374 13.8232 12.7626 13.5303 12.4697L12.4697 13.5303ZM10.6303 9.56966C10.3374 9.27677 9.86256 9.27677 9.56967 9.56966C9.27678 9.86256 9.27678 10.3374 9.56967 10.6303L10.6303 9.56966ZM10.9167 6.33333C10.9167 8.86463 8.86464 10.9167 6.33333 10.9167V12.4167C9.69307 12.4167 12.4167 9.69306 12.4167 6.33333H10.9167ZM6.33333 10.9167C3.80203 10.9167 1.75 8.86463 1.75 6.33333H0.25C0.25 9.69306 2.9736 12.4167 6.33333 12.4167V10.9167ZM1.75 6.33333C1.75 3.80202 3.80203 1.74999 6.33333 1.74999V0.249992C2.9736 0.249992 0.25 2.97359 0.25 6.33333H1.75ZM6.33333 1.74999C8.86464 1.74999 10.9167 3.80202 10.9167 6.33333H12.4167C12.4167 2.97359 9.69307 0.249992 6.33333 0.249992V1.74999ZM13.5303 12.4697L10.6303 9.56966L9.56967 10.6303L12.4697 13.5303L13.5303 12.4697Z" fill="currentColor" />
                        </svg>
                        Explore
                      </popover-button>
                    </router-link>
                    <router-link to="/soon">
                      <popover-button as="div" class="menu-link">
                        <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10.6676 2.33369C10.176 2.33369 9.77875 1.93646 9.77875 1.4448C9.77875 0.95313 10.176 0.555908 10.6676 0.555908H15.1121C15.6038 0.555908 16.001 0.95313 16.001 1.4448V5.88924C16.001 6.38091 15.6038 6.77813 15.1121 6.77813C14.6204 6.77813 14.2232 6.38091 14.2232 5.88924V3.59202L9.51764 8.2948C9.17042 8.64202 8.60931 8.64202 8.26209 8.2948L5.30931 5.3698L1.51848 9.18369C1.17125 9.53091 0.608477 9.53091 0.26131 9.18369C-0.0858012 8.83646 -0.0858012 8.27535 0.26131 7.92813L4.70653 3.48369C5.05375 3.13646 5.61487 3.13646 5.96209 3.48369L8.88987 6.40869L12.9649 2.30869L10.6676 2.33369Z" fill="currentColor" />
                        </svg>
                        Rankings
                      </popover-button>
                    </router-link>
                    <router-link to="/soon">
                      <popover-button as="div" class="menu-link">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5.93054 5.20069C5.7438 5.57042 5.89215 6.02153 6.26189 6.20826C6.63162 6.395 7.08273 6.24665 7.26946 5.87691L5.93054 5.20069ZM8 7.6157L7.58687 6.98974L7.25 7.21208V7.6157H8ZM7.25 8.7C7.25 9.11421 7.58579 9.45 8 9.45C8.41421 9.45 8.75 9.11421 8.75 8.7H7.25ZM8.75 11.15C8.75 10.7358 8.41421 10.4 8 10.4C7.58579 10.4 7.25 10.7358 7.25 11.15H8.75ZM7.25 11.5C7.25 11.9142 7.58579 12.25 8 12.25C8.41421 12.25 8.75 11.9142 8.75 11.5H7.25ZM14.25 8C14.25 11.4518 11.4518 14.25 8 14.25V15.75C12.2802 15.75 15.75 12.2802 15.75 8H14.25ZM8 14.25C4.54822 14.25 1.75 11.4518 1.75 8H0.25C0.25 12.2802 3.71979 15.75 8 15.75V14.25ZM1.75 8C1.75 4.54822 4.54822 1.75 8 1.75V0.25C3.71979 0.25 0.25 3.71979 0.25 8H1.75ZM8 1.75C11.4518 1.75 14.25 4.54822 14.25 8H15.75C15.75 3.71979 12.2802 0.25 8 0.25V1.75ZM7.26946 5.87691C7.42877 5.56149 7.54422 5.41881 7.63411 5.34769C7.69784 5.29727 7.78772 5.25 8 5.25V3.75C7.51228 3.75 7.07716 3.87563 6.70339 4.17136C6.35578 4.44639 6.12123 4.82311 5.93054 5.20069L7.26946 5.87691ZM8 5.25C8.40635 5.25 8.65 5.55292 8.65 5.8846H10.15C10.15 4.83168 9.33805 3.75 8 3.75V5.25ZM8.65 5.8846C8.65 6.06838 8.616 6.15293 8.52021 6.26662C8.38053 6.43239 8.11871 6.63872 7.58687 6.98974L8.41313 8.24166C8.93129 7.89968 9.36947 7.58661 9.66729 7.23316C10.009 6.82762 10.15 6.39312 10.15 5.8846H8.65ZM7.25 7.6157V8.7H8.75V7.6157H7.25ZM7.25 11.15V11.5H8.75V11.15H7.25Z" fill="currentColor" />
                        </svg>
                        How it works
                      </popover-button>
                    </router-link>
                    <router-link to="/soon">
                      <popover-button as="div" class="menu-link">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M0 11.6667H5.83333V12.8333H0V11.6667ZM0 8.16667H5.83333V9.33333H0V8.16667ZM12.8333 5.83333H1.16667C0.857247 5.83333 0.560501 5.71042 0.341709 5.49162C0.122916 5.27283 0 4.97609 0 4.66667V1.16667C0 0.857247 0.122916 0.560501 0.341709 0.341709C0.560501 0.122916 0.857247 0 1.16667 0H12.8333C13.1428 0 13.4395 0.122916 13.6583 0.341709C13.8771 0.560501 14 0.857247 14 1.16667V4.66667C14 4.97609 13.8771 5.27283 13.6583 5.49162C13.4395 5.71042 13.1428 5.83333 12.8333 5.83333ZM1.16667 1.16667V4.66667H12.8333V1.16667H1.16667ZM12.8333 14H9.33333C9.02391 14 8.72717 13.8771 8.50838 13.6583C8.28958 13.4395 8.16667 13.1428 8.16667 12.8333V9.33333C8.16667 9.02391 8.28958 8.72717 8.50838 8.50838C8.72717 8.28958 9.02391 8.16667 9.33333 8.16667H12.8333C13.1428 8.16667 13.4395 8.28958 13.6583 8.50838C13.8771 8.72717 14 9.02391 14 9.33333V12.8333C14 13.1428 13.8771 13.4395 13.6583 13.6583C13.4395 13.8771 13.1428 14 12.8333 14ZM9.33333 9.33333V12.8333H12.8333V9.33333H9.33333Z" fill="currentColor" />
                        </svg>
                        Blog
                      </popover-button>
                    </router-link>
                    <hr class="mt-5 border-0">
                    <router-link to="/soon">
                      <popover-button as="div" class="menu-link">Help center</popover-button>
                    </router-link>
                    <hr class="mt-10 border-0">
                    <menu-socials />
                  </popover-panel>
                </transition-child>
              </transition-root>
            </popover>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup>
import TheLogo from '@/components/TheLogo.vue';
import MenuSocials from '@/components/MenuSocials.vue';
import ButtonWallet from '@/components/ButtonWallet.vue';
import ButtonSecondary from '@/components/ButtonSecondary.vue';
import { Popover, PopoverButton, PopoverOverlay, PopoverPanel, TransitionRoot, TransitionChild } from '@headlessui/vue';

</script>

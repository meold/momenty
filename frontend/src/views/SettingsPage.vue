<template>
  <div>
    <h1 class="font-display text-2xl leading-tight mb-10">
      Edit Profile
    </h1>
    <form-kit ref="form" v-model="data" :actions="false" type="form" autocomplete="off" @submit="submit">
      <div class="grid grid-cols-1 gap-x-20 md:grid-cols-2">

        <form-kit-schema :schema="schema" />

      </div>
    </form-kit>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const form = ref(null);
const data = ref({});

const schema = [
  {
    $formkit: 'file',
    name: 'avatar',
    label: 'Avatar',
    classes: {
      label: 'text-xl font-bold mb-2',
      input: 'placeholder:text-sm placeholder:opacity-30 placeholder:text-black w-full',
      outer: 'relative row-span-2',
      messages: 'absolute right-0'
    },
    placeholder: 'Enter title (maximum 120 symbols)',
    validation: 'required|length:1,120',
    validationVisibility: 'blur'
  },
  {
    $formkit: 'text',
    name: 'name',
    label: 'Display name',
    classes: {
      label: 'text-xl font-bold mb-2',
      input: 'placeholder:text-sm placeholder:opacity-30 placeholder:text-black w-full',
      outer: 'relative',
      messages: 'absolute right-0'
    },
    placeholder: 'Enter title (maximum 120 symbols)',
    validation: 'required|length:1,120',
    validationVisibility: 'blur'
  },
  {
    $formkit: 'text',
    name: 'title1',
    label: 'Title',
    classes: {
      label: 'text-xl font-bold mb-2',
      input: 'placeholder:text-sm placeholder:opacity-30 placeholder:text-black w-full',
      outer: 'relative',
      messages: 'absolute right-0'
    },
    placeholder: 'Enter title (maximum 120 symbols)',
    validation: 'required|length:1,120',
    validationVisibility: 'blur'
  },
  {
    $formkit: 'textarea',
    name: 'description',
    label: 'Description',
    classes: {
      label: 'text-xl font-bold mb-2',
      input: 'placeholder:text-sm placeholder:opacity-30 placeholder:text-black w-full',
      outer: 'relative',
      messages: 'absolute right-0'
    },
    placeholder: 'Enter description (maximum 400 symbols)',
    validation: 'required|length:1,400',
    validationVisibility: 'blur'
  },
  {
    $formkit: 'textarea',
    name: 'description2',
    label: 'Description',
    classes: {
      label: 'text-xl font-bold mb-2',
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

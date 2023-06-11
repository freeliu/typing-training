<script setup lang="ts">
import { ref } from 'vue'

const title = ref('')
const description = ref('')

function submit(){

}

</script>
<template>
  <div class="bg-gray-900 min-h-screen text-white pt-8">
    <form class="max-w-2xl mx-auto">
      <div class="mb-4">
        <label for="title" class="block mb-2 font-bold">Title</label>
        <input type="text" id="title" v-model="title" class="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500">
      </div>
      <div class="mb-4">
        <label for="description" class="block mb-2 font-bold">Description</label>
        <textarea id="description" rows="8" v-model="description" class="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500"></textarea>
      </div>
      <button @submit.prevent="submit" type="submit" class="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Submit</button>
    </form>
  </div>
</template>



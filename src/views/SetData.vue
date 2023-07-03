<script setup lang="ts">
import { ref } from 'vue'
import { useListStore } from '../stores/list.js'
import { useRouter } from 'vue-router'
const store = useListStore()
const router = useRouter()

const title = ref('')
const description = ref('')

function submit() {
  store.setData(description.value.replace(/\s\s+|\n|\r\n/g, ' '))
  router.push({ path: '/' })
}
</script>
<template>
  <div class="bg-gray-900 min-h-screen text-white pt-8">
    <form class="max-w-2xl mx-auto">
      <div class="mb-4 mt-20">
        <textarea
          id="description"
          rows="8"
          v-model="description"
          class="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500"
        ></textarea>
      </div>
      <span>{{ description }}</span>
      <button
        @click="submit"
        class="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
      >
        Submit
      </button>
    </form>
  </div>
</template>

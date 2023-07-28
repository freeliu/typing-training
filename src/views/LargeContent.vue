<script lang="ts" setup>
import type { Directive } from 'vue'
import { computed, onMounted, ref, watch } from 'vue'
import { useListStore } from '../stores/list.js'
import DisplayContent from '@/components/DisplayContent.vue'
import { useNow } from '@vueuse/core'
import { handleChangLine } from '../assets/util'
const now = useNow()

const store = useListStore()

const sentences = ref<string>('')
const wordList = computed(() => {
  return sentences.value.split(' ').map((word) => {
    return {
      word,
      key: Symbol()
    }
  })
})

onMounted(() => {
  if (store.data) {
    sentences.value = handleChangLine(store.data)
  } else {
    sentences.value = `await break \n case catch class \n const continue debugger default \n delete do else true export false \n for if function let new null import return switch throw this try while`
  }
})

const wordSpeed = ref(0)
const characterSpeed = ref(0)

const inputText = ref('')
const isStarted = ref(false)
const startTime = ref(0)
const endTime = ref(0)

const textAreaElement = ref()

watch(isStarted, (value, oldValue) => {
  if (value && !oldValue) {
    startTime.value = new Date().getTime()
  }
})

function checkInput(event: Event) {
  endTime.value = new Date().getTime()
  // replace multiple spaces with single space
  // inputText.value = inputText.value.replace(/\s\s+/g, ' ')
  if (!inputText.value.includes(' ')) {
    return
  }

  // calculate speed
  const timeDiff = (endTime.value - startTime.value) / 1000

  const inputWordsCount = inputText.value.split(' ').length
  wordSpeed.value = Math.round((inputWordsCount / timeDiff) * 60)
  characterSpeed.value = Math.round((inputText.value.replace(/\s\s+/g, '').length / timeDiff) * 60)
}

let errorSet = new Set<string>()

const errorCharacters = ref(new Set())

function vUpdateErrorWord(el: HTMLElement) {
  const errorCharacter = el.querySelector('.incorrect')
  if (errorCharacter) {
    errorSet.add(el.dataset?.word?.trim().replace(/\n/, '') as string)
    errorCharacters.value.add(errorCharacter)
  }
}

function formatTime(ms: number) {
  const seconds = Math.floor(ms / 1000)
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  const formattedHours = String(hours).padStart(2, '0')
  const formattedMinutes = String(minutes).padStart(2, '0')
  const formattedSeconds = String(remainingSeconds).padStart(2, '0')

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
}

const pastTime = computed(() => {
  if (startTime.value > 0) {
    return formatTime(now.value.getTime() - startTime.value)
  } else {
    return formatTime(0)
  }
})
</script>

<template>
  <div class="bg-gray-900 text-gray-500 min-h-screen">
    <div class="flex justify-between items-center px-4 py-2 bg-gray-800">
      <h1>
        Time <span class="mx-2.5">{{ pastTime }}</span> Total Words {{ wordList.length }}
      </h1>
      <div>
        <span style="min-width: 33px">{{ wordSpeed }} </span> WPM
        <span style="min-width: 33px">{{ characterSpeed }}</span> Characters
      </div>
    </div>

    <div class="mx-auto flex gap-1 mt-5 px-4">
      <div class="w-1/2 text-2xl mb-8 py-4 box-content">
        <DisplayContent :input-text="inputText" :word-list="wordList" @update="vUpdateErrorWord" />
      </div>
      <textarea
        v-model="inputText"
        @keydown="isStarted = true"
        ref="textAreaElement"
        autofocus
        class="bg-gray-800 w-1/2 text-2xl p-4 rounded overflow-clip outline-0"
        type="text"
        @input="checkInput"
      />
    </div>
  </div>
</template>

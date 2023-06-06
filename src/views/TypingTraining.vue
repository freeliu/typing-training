<script lang="ts" setup>
import { computed, nextTick, ref, watch } from 'vue'
import type { Directive } from 'vue'
import { chunkArray } from '../assets/util.js'

const sentences = ref<string>('hello world')

const speed = ref(0)
const accuracy = ref(100)

const inputText = ref('')
const startTime = ref(0)
const endTime = ref(0)

const vUpdate: Directive = {
  updated(el: HTMLElement) {
    if(el.clientWidth>800){
      inputWidth.value.width = el.clientWidth + 'px'
    }
  }
}

const currentSentenceIndex = ref(0)
const currentSentence = computed(() => {
  return sentences.value[currentSentenceIndex.value] as string
})

const inputWidth = ref({ width: '800px' })

function startNewSentence() {
  if (currentSentenceIndex.value < sentences.value.length - 1) {
    currentSentenceIndex.value++
    inputText.value = ''
  }
}

function checkInput() {
  if (inputText.value === currentSentence.value) {
    endTime.value = new Date().getTime()
    const timeDiff = (endTime.value - startTime.value) / 1000
    const wordCount = currentSentence.value.split(' ').length
    speed.value = Math.round((wordCount / timeDiff) * 60)
    accuracy.value =
      Math.round((currentSentence.value.length / inputText.value.length) * 100) || 100
    startNewSentence()
  } else if (inputText.value.length === 1) {
    startTime.value = new Date().getTime()
  }
}

function readJson(event: Event) {
  const fileReader = new FileReader()
  fileReader.onload = onloadData
  //@ts-ignore
  fileReader.readAsText(event.target.files[0])
  function onloadData(event: Event) {
    //@ts-ignore
    sentences.value = event.target?.result
    inputText.value=''
  }
}
</script>

<template>
  <div class="bg-gray-900 text-white min-h-screen">
    <div class="container mx-auto min-h-screen flex flex-col items-center">
      <div v-update class="text-2xl mb-8 mt-20 px-4 box-content whitespace-pre">
        <span
          v-for="(char, index) in sentences.split('')"
          :key="index"
          :class="{
            correct: inputText[index] === char,
            incorrect: inputText[index] !== char && index < inputText.length
          }"
        >
          {{ char }}
        </span>
      </div>

      <input
        v-model="inputText"
        :style="inputWidth"
        autofocus
        class="bg-gray-800 text-white text-2xl p-4 rounded"
        type="text"
        @input="checkInput"
      />
      <div class="flex justify-between mt-4 text-lg opacity-70" :style="inputWidth">
        <div>Typing Speed: {{ speed }} WPM</div>
        <div>Accuracy: {{ accuracy }}%</div>
        <label class="cursor-pointer">
          load data
          <input class="opacity-0 w-0 h-0" type="file" @change="readJson" accept="text/plain" />
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped>
.correct {
  color: #10b981;
}

.incorrect {
  color: #ef4444;
}
</style>

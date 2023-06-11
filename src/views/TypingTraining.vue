<script lang="ts" setup>
import type { Directive, Events } from 'vue'
import { ref, watch } from 'vue'

const sentences = ref<string>('await break case catch class const continue debugger default delete do else true\n' +
    'export false for if function let new null import return switch throw this try while')
const config = {
  autoReset: true
}

const speed = ref(0)
const errorCount = ref(0)

const inputText = ref('')
const startTime = ref(0)
const endTime = ref(0)

const textAreaElement = ref()

const vUpdate: Directive = {
  updated(el: HTMLElement) {
    let { clientWidth, clientHeight } = el
    if (clientWidth > 200) {
      clientWidth = Math.max(clientWidth, 400)
      contentStyle.value.width = clientWidth + 2 + 'px'
    }
    if (clientHeight > 64) {
      contentStyle.value.height = clientHeight + 2 + 'px'
    }
  }
}

const contentStyle = ref({ width: '800px', height: '64px' })

watch(inputText, (value, oldValue) => {
  if (value && oldValue === '') {
    startTime.value = new Date().getTime()
  }
})

function checkInput(event: InputEvent) {
  endTime.value = new Date().getTime()
  const timeDiff = (endTime.value - startTime.value) / 1000
  const wordCount = sentences.value.split(' ').length
  speed.value = Math.round((wordCount / timeDiff) * 60)

  for (let index = 0; index < sentences.value.length; index++) {
    let char = sentences.value[index]
    if (inputText.value[index] !== char && index < inputText.value.length) {
      errorCount.value++
    }
  }
  if (config.autoReset && event.inputType === 'insertLineBreak') {
    if (inputText.value.trim() === sentences.value.trim()) {
      reset()
    }
  }
}

function readJson(event: Event) {
  const fileReader = new FileReader()
  fileReader.onload = onloadData
  //@ts-ignore
  fileReader.readAsText(event.target.files[0])
  //@ts-ignore
  event.target.value = ''
  function onloadData(event: Event) {
    //@ts-ignore
    sentences.value = event.target?.result
    reset()
  }
}
let errorSet = new Set<string>()

function reset() {
  inputText.value = ''
  errorCount.value = 0
  speed.value = 0
  textAreaElement.value.focus()
  errorSet = new Set<string>()
}

const vUpdateErrorWord: Directive = {
  updated(el: HTMLElement) {
    if (el.querySelector('.incorrect')) {
      errorSet.add(el.dataset?.word?.trim() as string)
    }
  }
}
function retryErrorWords() {
  let words = Array.from(errorSet)
  sentences.value = ''
  words.forEach((word) => {
    let str = String('').padEnd((word.length + 1) * 10 - 1, word + ' ')
    sentences.value += str + '\n'
  })

  reset()
}
</script>

<template>
  <div class="bg-gray-900 text-white min-h-screen">
    <div class="container mx-auto min-h-screen flex flex-col items-center">
      <div class="flex justify-end items-center w-full h-10 text-lg">
        <router-link class="link " to="/add">add</router-link>
        <router-link  class="ml-4 link" to="/list">list</router-link>
      </div>
      <div v-update class="text-2xl mb-8 mt-20 p-4 box-content whitespace-pre">
        <span
          v-for="(word, wordIndex) in sentences.split(' ')"
          :key="word + wordIndex"
          v-update-error-word
          :data-word="word"
        >
          <span
            v-for="(char, index) in word.split('')"
            :key="index"
            :class="{
              correct:
                inputText.split(' ')[wordIndex] && inputText.split(' ')[wordIndex][index] === char,
              incorrect:
                inputText.split(' ')[wordIndex] &&
                inputText.split(' ')[wordIndex][index] !== char &&
                index < inputText.split(' ')[wordIndex].length
            }"
          >
            {{ char }}
          </span>
          <span>&nbsp;</span>
        </span>
      </div>

      <textarea
        v-model="inputText"
        :style="contentStyle"
        ref="textAreaElement"
        autofocus
        class="bg-gray-800 text-white text-2xl p-4 rounded overflow-clip"
        type="text"
        @input="checkInput"
      />
      <div
        class="flex justify-between  text-lg opacity-70 infos mt-auto mb-5"
        :style="{ width: contentStyle.width }"
      >
        <div style="min-width: 190px">Typing Speed: {{ speed }} WPM</div>
        <div>Error Count: {{ errorCount }}</div>
        <div class="link" @click="reset">Retry</div>
        <div class="link" @click="retryErrorWords">Retry Error Words</div>
        <a href="./demo-data.txt" class="link"  download>Demo Data</a>
        <label class="link" >
          Import data
          <input class="opacity-0 w-0 h-0" type="file" @change="readJson" accept="text/plain" />
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped>
.link{
  @apply cursor-pointer hover:text-sky-500
}


.correct {
  color: #10b981;
}

.incorrect {
  color: #ef4444;
}
</style>

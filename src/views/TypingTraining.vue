<script lang="ts" setup>
import type { Directive } from 'vue'
import { computed, onMounted, ref, watch } from 'vue'
import { useListStore } from '../stores/list.js'

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

watch(wordList, (value) => {
  console.log(value)
})

onMounted(() => {
  if (store.data) {
    sentences.value = store.data
  } else {
    sentences.value = `await break case catch class const continue debugger default delete do else true export false for if function let new null import return switch throw this try while`
  }
})

const wordSpeed = ref(0)
const characterSpeed = ref(0)

const inputText = ref('')
const isStarted = ref(false)
const startTime = ref(0)
const endTime = ref(0)

const textAreaElement = ref()

const vUpdate: Directive = {
  // todo ? 输入框？
  updated(el: HTMLElement) {
    let { clientWidth, clientHeight } = el
    if (clientWidth > 200) {
      clientWidth = Math.max(clientWidth, 400)
      clientWidth = Math.min(clientWidth, 1000)
      contentStyle.value.width = clientWidth + 'px'
    }
    if (clientHeight > 64) {
      contentStyle.value.height = clientHeight + 'px'
    }
  },
  mounted(el: HTMLElement) {
    let { clientWidth, clientHeight } = el
    if (clientWidth > 200) {
      clientWidth = Math.max(clientWidth, 400)
      clientWidth = Math.min(clientWidth, 1000)
      contentStyle.value.width = clientWidth + 'px'
    }
    if (clientHeight > 64) {
      contentStyle.value.height = clientHeight + 'px'
    }
  }
}

const contentStyle = ref({ width: '800px', height: '64px' })

watch(isStarted, (value, oldValue) => {
  if (value && !oldValue) {
    startTime.value = new Date().getTime()
  }
})

function checkInput(event: InputEvent) {
  endTime.value = new Date().getTime()
  // replace multiple spaces with single space
  inputText.value = inputText.value.replace(/\s\s+/g, ' ')
  if (!inputText.value.includes(' ')) {
    return
  }

  // calculate speed
  const timeDiff = (endTime.value - startTime.value) / 1000

  const inputWordsCount = inputText.value.split(' ').length
  wordSpeed.value = Math.round((inputWordsCount / timeDiff) * 60)
  characterSpeed.value = Math.round((inputText.value.replace(/\s\s+/g, '').length / timeDiff) * 60)
}

function readFile(event: Event) {
  const fileReader = new FileReader()
  fileReader.onload = onloadData
  //@ts-ignore
  fileReader.readAsText(event.target.files[0])
  //@ts-ignore
  event.target.value = ''
  function onloadData(event: Event) {
    //@ts-ignore
    sentences.value = event.target?.result.replace(/\s\s+|\n|\r\n/g, ' ')
    reset()
  }
}
let errorSet = new Set<string>()

function reset() {
  inputText.value = ''
  wordSpeed.value = 0
  characterSpeed.value = 0
  errorCharacters.value = new Set()
  textAreaElement.value.focus()
  errorSet = new Set<string>()
  isStarted.value = false
}

const errorCharacters = ref(new Set())

const vUpdateErrorWord: Directive = {
  updated(el: HTMLElement) {
    const errorCharacter = el.querySelector('.incorrect')
    if (errorCharacter) {
      errorSet.add(el.dataset?.word?.trim().replace(/\n/, '') as string)
      errorCharacters.value.add(errorCharacter)
    }
  }
}
function retryErrorWords() {
  let words = Array.from(errorSet)
  sentences.value = ''
  words.forEach((word) => {
    let str = String('').padEnd((word.length + 1) * 10 - 1, word + ' ')
    sentences.value += str + ' '
  })
  console.log(sentences.value + ' ')

  reset()
}

function randomOrder() {
  let array = sentences.value.split(' ')
  let currentIndex = array.length
  let randomIndex
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--
    ;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
  }
  sentences.value = array.join(' ')
  reset()
}
</script>

<template>
  <div class="bg-gray-900 text-white min-h-screen">
    <div class="container mx-auto min-h-screen flex flex-col items-center">
      <div class="flex justify-end items-center w-full h-10 text-lg">
        <router-link tabindex="-1" class="link" to="/set-data">set data</router-link>
        <!--<router-link class="ml-4 link" to="/list">list</router-link>-->
      </div>
      <div
        class="flex justify-center text-lg opacity-50 mt-20 mb-2.5"
        :style="{ width: contentStyle.width }"
      >
        <div class="mr-4">
          Speed: <span style="min-width: 33px">{{ wordSpeed }} </span> WPM
        </div>
        |
        <div class="ml-4">
          <span style="min-width: 33px">{{ characterSpeed }}</span> Characters
        </div>
      </div>
      <div v-update class="text-2xl mb-8 p-4 box-content flex flex-wrap max-w-[920px]">
        <span
          v-for="({ word, key }, wordIndex) in wordList"
          :key="key"
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
                (inputText.split(' ')[wordIndex] &&
                  inputText.split(' ')[wordIndex][index] !== char &&
                  index < inputText.split(' ')[wordIndex].length) ||
                inputText.split(' ')[wordIndex]?.length > word.length
            }"
          >
            {{ char }}
          </span>
          <span>&nbsp;</span>
        </span>
      </div>
      <textarea
        v-model="inputText"
        @keydown="isStarted = true"
        :style="contentStyle"
        ref="textAreaElement"
        autofocus
        class="bg-gray-800 text-white text-2xl p-4 rounded overflow-clip outline-0"
        type="text"
        @input="checkInput"
      />

      <div
        class="flex justify-between text-lg opacity-70 infos mt-auto mb-5"
        :style="{ width: contentStyle.width }"
      >
        <div>Error: {{ errorCharacters.size }}</div>

        <div class="link" @click="reset">Retry</div>
        <div class="link" @click="retryErrorWords">Retry Error</div>
        <div class="link" @click="randomOrder">Random Order</div>
        <a tabindex="-2" href="./demo-data.txt" class="link" download>Demo Data</a>
        <label class="link">
          Import data
          <input class="opacity-0 w-0 h-0" type="file" @change="readFile" accept="text/plain" />
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped>
.link {
  @apply cursor-pointer hover:text-sky-500;
}

.correct {
  color: #10b981;
}

.incorrect {
  color: #ef4444;
}
</style>

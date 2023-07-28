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

function checkInput(event: Event) {
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

let errorSet = new Set<string>()


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


</script>

<template>
  <div class="bg-gray-900 text-white min-h-screen">
    <div class="flex justify-between items-center px-4 py-2 bg-gray-800">
      <h1 class="text-xl font-bold">Typing Test</h1>
      <p>
        <span style="min-width: 33px">{{ wordSpeed }} </span> WPM
        <span style="min-width: 33px">{{ characterSpeed }}</span> Characters
      </p>
    </div>

    <div class="mx-auto flex gap-1 mt-5 px-4">
      <div v-update class="flex-1 text-base mb-8 py-4 box-content flex flex-wrap">
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
        class="bg-gray-800 flex-1 text-white text-base p-4 rounded overflow-clip outline-0"
        type="text"
        @input="checkInput"
      />
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

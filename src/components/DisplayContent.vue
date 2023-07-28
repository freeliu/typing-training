<script setup lang="ts">
import { Directive } from 'vue/dist/vue.js'

const emit = defineEmits<{
  update: [dom: HTMLElement]
}>()

const props = defineProps<{
  wordList: { word: string; key: number | symbol | string }[]
  inputText: string
}>()

// vue以组件为单位patch，因为同级有 时间相关的dom更新，isCorrect会不断的执行
function isCorrect(word: string, wordIndex: number, char: string, index: number) {
  let text = props.inputText.trim()
  // 忽略多个空格，换行前后的空格
  text = text.replace(/ +/g, ' ')
  text = text.replace(/ +\n/g, '\n')
  text = text.replace(/\n +/g, '\n')
  text = text.replace(/\n/g, ' \n ')

  if (text.split(' ')[wordIndex] && text.split(' ')[wordIndex][index] === char) {
    return 'correct'
  }
  if (
    (text.split(' ')[wordIndex] &&
      text.split(' ')[wordIndex][index] !== char &&
      index < text.split(' ')[wordIndex].length) ||
    text.split(' ')[wordIndex]?.length > word.length
  ) {
    return 'incorrect'
  }
  return ''
}
const vUpdateErrorWord: Directive = {
  updated(el: HTMLElement) {
    emit('update', el)
  }
}
</script>

<template>
  <template v-for="({ word, key }, wordIndex) in wordList" :key="key">
    <br v-if="word === '\n'" />
    <span v-else v-update-error-word :data-word="word">
      <span
        v-for="(char, index) in word.split('')"
        :key="char"
        :class="isCorrect(word, wordIndex, char, index)"
      >
        {{ char }}
      </span>
      <span>&nbsp;</span>
    </span>
  </template>
</template>

<style scoped></style>

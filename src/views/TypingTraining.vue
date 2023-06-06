<script lang="ts" setup>
import type {Directive} from 'vue'
import {ref, watch} from 'vue'

const sentences = ref<string>('hello world')

const speed = ref(0)
const errorCount = ref(100)

const inputText = ref('')
const startTime = ref(0)
const endTime = ref(0)

const textAreaElement=ref()

const vUpdate: Directive = {
  updated(el: HTMLElement) {
    if(el.clientWidth>800){
      contentStyle.value.width = el.clientWidth + 'px'
    }
    if(el.clientHeight>64){
      contentStyle.value.height = el.clientHeight + 'px'
    }

  }
}



const contentStyle = ref({ width: '800px', height:'64px' })

watch(inputText,(value, oldValue)=>{
  if(value&&oldValue==='')
  {
    startTime.value= new Date().getTime()
  }
})

function checkInput() {
    endTime.value = new Date().getTime()
    const timeDiff = (endTime.value - startTime.value) / 1000
    const wordCount = sentences.value.split(' ').length
    speed.value = Math.round((wordCount / timeDiff) * 60)

  for (let index = 0; index < sentences.value.length; index++) {
    let char=sentences.value[index]
    if(inputText.value[index] !== char && index < inputText.value.length){
      errorCount.value++
    }
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
    reset()
  }
}

function reset(){
  inputText.value=''
  errorCount.value=0
  speed.value=0
  textAreaElement.value.focus()
}
</script>

<template>
  <div class="bg-gray-900 text-white min-h-screen">
    <div class="container mx-auto min-h-screen flex flex-col items-center">
      <div v-update class="text-2xl mb-8 mt-20 p-4 box-content whitespace-pre">
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

      <textarea
        v-model="inputText"
        :style="contentStyle"
        ref="textAreaElement"
        autofocus
        class="bg-gray-800 text-white text-2xl p-4 rounded overflow-clip"
        type="text"
        @input="checkInput"
      />
      <div class="flex justify-between mt-4 text-lg opacity-70" :style="{width:contentStyle.width}">
        <div>Typing Speed: {{ speed }} WPM</div>
        <div>Error Count: {{ errorCount }}</div>
        <div class="cursor-pointer" @click="reset">Reset</div>
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

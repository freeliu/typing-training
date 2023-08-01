import { ref, computed, toValue } from 'vue'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'
import type { Item } from '@/types/store'
import { useStorage } from '@vueuse/core'
import { uuid } from '@/assets/util'

export const useListStore = defineStore('list', () => {
  const list = useStorage('type-training-item', [] as Item[])
  const getItemById = computed(() => {
    return (id: string) => list.value.find((item) => item.id === id)
  })
  function addItem(item: Item) {
    item = toValue(item)
    if (!item.id) {
      item.id = uuid()
    }
    list.value.push(item)
  }
  function setItem(item: Item) {
    item = toValue(item)
    const lsItem = list.value.find((itm) => itm.id === item.id)
    if (lsItem) {
      Object.assign(lsItem, item)
    }
  }

  return {
    list,
    getItemById,
    addItem,
    setItem
  }
})

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

interface Item {
  id?: number | string
  title: string
  desc: string
}

export const useListStore = defineStore('list', {
  state: () => ({ list: [] as Item[], data: '' }),
  getters: {
    getItemById: (state) => {
      return (id: number | string) => state.list.find((item) => item.id === id)
    }
  },
  actions: {
    setData(data: string) {
      this.data = data
    },
    addItem(item: Item) {
      this.list.push(item)
    }
  }
})

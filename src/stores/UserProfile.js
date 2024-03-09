import { defineStore } from 'pinia'

export const useUserProfileStore = defineStore('userProfile', {
  state() {
    return {
      name: null
    }
  },
  persist: {
    enabled: false,
    strategies:
      [
        {
          storage: localStorage, paths: ['name']
        }
      ]
  },
  actions: {
    setName(name) {
      this.name = name
      console.log(this.name)
    }
  }
})
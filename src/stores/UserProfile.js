import { defineStore } from 'pinia'

export const useUserProfileStore = defineStore('userProfile', {
  state() {
    return {
      name: '',
    }
  },
  actions: {
    setName(name) {
      this.name = name;
    }
  }
})
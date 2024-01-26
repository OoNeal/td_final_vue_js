import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state() {
    return {
      apiKey: null,
      returnUrl: null
    }
  },
  persist: {
    enabled: true,
    strategies:
      [
        {
          storage: localStorage, paths: ['apiKey']
        }
      ]
  },
  actions: {
    setApiKey(apiKey) {
      this.apiKey = apiKey
    },
    setReturnUrl(returnUrl) {
      this.returnUrl = returnUrl
    }
  }
})
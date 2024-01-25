import { defineStore } from 'pinia'

const useAuthStore = defineStore('auth', {
  state: () => {
    return {
      apiKey: null,
      returnUrl: null
    }
  },
  persist: {
    enabled: true,
    strategies: [
      {
        storage: localStorage, paths: ['apiKey']
      }
    ]
  }
})


export const setApiKey = (apiKey) => {
  useAuthStore().apiKey = apiKey
}

export const getApiKey = () => {
  return useAuthStore().apiKey
}

export const setReturnUrl = (returnUrl) => {
  useAuthStore().returnUrl = returnUrl
}

export const getReturnUrl = () => {
  return useAuthStore().returnUrl
}
import { defineStore } from 'pinia'

// Définition d'un store nommé 'auth' (convention de mettre use...Store)
export const useAuthStore = defineStore('auth', {
  // State contient les différentes variables du store
  state() {
    return {
      apiKey: null,
      returnUrl: null
    }
  },
  // Persist permet de sauvegarder les données du store dans le local storage
  persist: {
    enabled: true,
    strategies:
      [
        {
          storage: localStorage, paths: ['apiKey']
        }
      ]
  },
  // Actions contient les différentes fonctions du store
  actions: {
    setApiKey(apiKey) {
      this.apiKey = apiKey
    },
    setReturnUrl(returnUrl) {
      this.returnUrl = returnUrl
    }
  }
})
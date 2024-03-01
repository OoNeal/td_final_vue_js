import {defineStore} from 'pinia'

export const useCurrentActivityStore = defineStore('currentActivity', {
    state() {
        return {
            currentTimeEntry: "coucou",
        }
    },
    persist: {
        enabled: true,
        strategies:
            [
                {
                    storage: localStorage, paths: ['activity']
                }
            ]
    },
    actions: {
        setCurrentTimeEntry(entry) {
            console.log("CTE ds store avant set", this.currentTimeEntry)
            this.currentTimeEntry = entry
            console.log("CTE ds le store", this.currentTimeEntry)
        },
        deleteCurrentTimeEntry() {
            this.currentTimeEntry = null
            console.log("CTE deleted from store")
        },
    }
})
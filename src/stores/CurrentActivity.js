import {defineStore} from 'pinia'

export const useCurrentActivityStore = defineStore('currentActivity', {
    state() {
        return {
            currentTimeEntry: null,
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
            this.currentTimeEntry = entry
        },
        deleteCurrentTimeEntry() {
            this.currentTimeEntry = null
        },
    }
})
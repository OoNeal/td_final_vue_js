import {defineStore} from 'pinia'

export const useCurrentActivityStore = defineStore('currentActivity', {
    state() {
        return {
            currentTimeEntry: null,
        }
    },
    persist: {
        enabled: false,
        strategies:
            [
                {
                    storage: localStorage, paths: ['currentTimeEntry']
                }
            ]
    },
    actions: {
        setCurrentTimeEntry(entry) {
            this.currentTimeEntry = entry
        },
        deleteCurrentTimeEntry() {
            this.currentTimeEntry = null
        }
    }
})
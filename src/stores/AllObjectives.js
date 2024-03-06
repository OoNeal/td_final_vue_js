import {defineStore} from 'pinia'

export const useAllObjectivesStore = defineStore('allObjectives', {
    state() {
        return {
            allObjectives: []
        }
    },
    persist: {
        enabled: false,
        strategies:
            [
                {
                    storage: localStorage, paths: ['objectives']
                }
            ]
    },
    actions: {
        setObjectives(objectives) {
            this.allObjectives = objectives
            this.allObjectives.sort((a, b) => new Date(b.date) - new Date(a.date))
        },
        addObjective(objective) {
            this.allObjectives.unshift(objective)
        }
    }
})
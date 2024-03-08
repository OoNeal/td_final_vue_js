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
                    storage: localStorage, paths: ['allObjectives']
                }
            ]
    },
    actions: {
        setObjectives(objectives) {
            this.allObjectives = objectives
        },
        addObjective(objective) {
            this.allObjectives.unshift(objective)
        }
    }
})
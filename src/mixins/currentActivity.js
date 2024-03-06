import {useCurrentActivityStore} from "@/stores/CurrentActivity.js";
import {mapActions, mapState} from 'pinia'

const currentActivity = {
    data() {
        return {
            timer: null
        }
    },
    computed: {
        ...mapState(useCurrentActivityStore, ['currentTimeEntry']),
    },
    methods: {
        ...mapActions(useCurrentActivityStore, ['setCurrentTimeEntry', 'deleteCurrentTimeEntry']),
        getCurrentActivity() {
            this.$api.get('time-entries?end=').then((resp) => {
                //call API
                //on set dans le store et on lance le timer si il y a une time entry en cours
                resp.data[0] ? (this.setCurrentTimeEntry(resp.data[0])) : null
            }).catch((err) => {
                console.log(err)
            })
        },
        stopActivity() {
            this.$api.patch(`time-entries/${this.currentTimeEntry.id}/stop`).then(() => {
                this.deleteCurrentTimeEntry()
                this.timer = null
            }).catch((err) => {
                console.log(err.response.data)
            })
        },
        calcTimeSince() {
            if (this.currentTimeEntry !== null) {
                const date = new Date(this.currentTimeEntry.start);
                const difference = new Date().getTime() - date.getTime();
                const jours = Math.floor(difference / (1000 * 60 * 60 * 24));
                const heures = Math.floor(difference / (1000 * 60 * 60));
                let minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                let secondes = Math.floor((difference % (1000 * 60)) / 1000);
                if (secondes < 10) {
                    secondes = '0' + secondes;
                }
                if (minutes < 10) {
                    minutes = '0' + minutes;
                }
                if (jours !== 0) {
                    this.timer = jours + "j " + heures + "h " + minutes + "m " + secondes + "s"
                } else if (heures !== 0) {
                    this.timer = heures + ":" + minutes + ":" + secondes
                } else {
                    this.timer = minutes + ":" + secondes
                }
            }
        },
        startTimer() {
            window.setInterval(() => {
                this.calcTimeSince()
            }, 1000)
        }
    }
};

export default currentActivity
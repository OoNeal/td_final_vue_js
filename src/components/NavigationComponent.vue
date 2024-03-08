<script>
import currentActivity from "@/mixins/currentActivity.js";
import {mapActions, mapState} from 'pinia'
import {useAllObjectivesStore} from "@/stores/allObjectives.js";
import {toast} from "vue3-toastify";
import ToastOptions from "../../toasts/toastOptions.js";

export default {
  mixins: [currentActivity],
  props: {
    connected: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      user: "",
      objectives: [],
      objectivesDone: [],
      timeEntries: [],
      timeWorked: 0,
    }
  },
  computed: {
    isOnActivity() {
      return this.$route.path === "/"
    },
    ...mapState(useAllObjectivesStore, ['allObjectives']),
  },
  methods: {
    ...mapActions(useAllObjectivesStore, ['setObjectives']),
    calcHoursWorked() {
      const today = new Date().toISOString().slice(0, 10);
      let totalMillisecondsWorked = 0;
      this.timeEntries.forEach(entry => {
        const start = new Date(entry.start);
        const end = new Date(entry.end);
        if (start.getDate() === end.getDate()) {
          totalMillisecondsWorked += end.getTime() - start.getTime();
        } else {
          const midnightToday = new Date(today).setHours(0, 0, 0, 0);
          totalMillisecondsWorked += end.getTime() - midnightToday;
        }
      })
      const hoursWorked = Math.floor(totalMillisecondsWorked / (1000 * 60 * 60));
      const minutesWorked = Math.floor((totalMillisecondsWorked % (1000 * 60 * 60)) / (1000 * 60));

      hoursWorked ? this.timeWorked = hoursWorked + "h" + minutesWorked : this.timeWorked = minutesWorked + "min";
    },
    getTimeEntries() {
      this.$api.get('time-entries').then((resp) => {
        //je fais la même dans activity view donc à factoriser ??? mais ds le store c bad chiant
        //il faut prendre l'activité actuelle aussi ?
        this.timeEntries = resp.data.filter(entry => entry.end && entry.end.split(' ')[0] === new Date().toISOString().slice(0, 10));
        this.calcHoursWorked()
      }).catch((err) => {
        console.log(err)
      })
    }
  },
  created() {
    if (this.connected) {
      this.$api.get('profile').then((resp) => {
        this.user = resp.data.name
      }).catch((err) => {
        console.log(err)
      })

      this.$api.get(`daily-objectives?date=${new Date().toISOString().slice(0, 10)}`).then((resp) => {
        if (resp.data.length > 0) {
          this.setObjectives(resp.data)
          this.objectivesDone = this.allObjectives.filter((obj) => obj.done)
        }
      }).catch((err) => {
        console.log(err)
      })

      this.getCurrentActivity()
      this.getTimeEntries()
    }
  },
  watch: {
    currentTimeEntry() {
      this.currentTimeEntry ? this.startTimer() : (this.timer = null, this.getTimeEntries())
    },
    allObjectives() {
      this.objectives = this.allObjectives
      this.objectivesDone = this.allObjectives.filter((obj) => obj.done)
    }
  }
}

</script>

<template>
  <header v-if="!connected">
    <div class="logo">
      <div>TIME</div>
      <div>LY</div>
    </div>
    <div class="greetings">
      Bienvenue sur Timely !
    </div>
    <nav>
      <RouterLink to="/auth/login">Se connecter</RouterLink>
      <RouterLink to="/auth/register">S'inscrire</RouterLink>
    </nav>
  </header>

  <header v-if="connected">
    <div class="logo">
      <div>TIME</div>
      <div>LY</div>
    </div>
    <nav>
      <RouterLink to="/">Activité</RouterLink>
      <RouterLink to="/reporting">Statistiques</RouterLink>
      <RouterLink to="/settings">Paramètres</RouterLink>
    </nav>
    <RouterLink class="profile" to="/settings/profile">
      <div>{{ user }}</div>
      <img src="/icons/user.svg" alt="user icon">
    </RouterLink>
  </header>

  <div class="infos" v-if="connected">
    <div class="objectives">
      <span v-if="objectives">{{ objectivesDone.length }} / {{ objectives.length }}</span>
    </div>
    <div v-if="!isOnActivity && timer" class="current-activity">
      <div>{{ timer }}</div>
      <img @click="stopActivity" src="/icons/stopFull.svg" alt="stop icon">
    </div>
    <div class="hours">
      {{ timeWorked }}
    </div>
  </div>
</template>


<style scoped lang="scss">

header {
  background-color: #1C1C1C;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1em;
}

.logo {
  display: flex;
  font-size: 1.5em;
  font-weight: 500;

  div:nth-child(1) {
    color: #ECBA07;
  }
}


nav {
  display: flex;
  align-items: center;
  gap: 2em;
}

a {
  color: inherit;
  text-decoration: none;
}

.profile {
  display: flex;
  gap: .5em;
  align-items: center;

  img {
    height: 1.5em;
  }
}

.greetings {
  color: #ECBA07;
}

.router-link-active {
  color: #ECBA07;
  font-weight: 500;
}

.infos {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1em;
  padding-top: .5em;
  background-color: #1C1C1C;
  font-size: .9em;
  gap: 1em;

}

.current-activity {
  display: flex;
  gap: .5em;
  align-items: center;
  justify-content: center;
  font-size: 1.5em;

  img {
    height: .7em;
  }
}

</style>
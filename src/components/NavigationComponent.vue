<script>
import currentActivity from "@/mixins/currentActivity.js";

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
      allObjectives: [],
      objectivesDone: [],
      timeWorked: 0,
    }
  },
  computed: {
    isOnActivity() {
      return this.$route.path === "/"
    },
  },
  created() {
    if (this.connected) {
      this.$api.get('profile').then((resp) => {
        this.user = resp.data.name
      }).catch((err) => {
        console.log(err)
      })

      this.$api.get('daily-objectives').then((resp) => {
        //le nombre d’objectifs atteints aujourd’hui (sur le nombre d’objectif total)
        this.allObjectives = resp.data
        this.allObjectives.sort((a, b) => new Date(b.date) - new Date(a.date))
        this.objectivesDone = this.allObjectives.filter((obj) => obj.done)
      }).catch((err) => {
        console.log(err)
      })

      this.getCurrentActivity()

      this.$api.get('time-entries').then((resp) => {
        //je fais la même dans activity view donc à factoriser ??? mais ds le store c bad chiant
        //il faut prendre l'activité actuelle aussi ?
        const today = new Date().toISOString().slice(0, 10);
        const timeEntriesToday = resp.data.filter(entry => entry.end && entry.end.split(' ')[0] === today);
        let totalMillisecondsWorked = 0;
        timeEntriesToday.forEach(entry => {
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
        console.log("Temps travaillé aujourd'hui:", hoursWorked, "heures et", minutesWorked, "minutes");
      }).catch((err) => {
        console.log(err)
      })
    }
  },
  watch: {
    currentTimeEntry() {
      //this.getCurrentActivity()
      this.currentTimeEntry ? this.startTimer() : this.timer = null
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
      {{ objectivesDone.length }} / {{ allObjectives.length }}
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
  color: white;
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
  color: white;
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
  color: white;
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
    height: 1em;
  }
}

</style>
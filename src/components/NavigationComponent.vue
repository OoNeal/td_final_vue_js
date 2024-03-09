<script>
import currentActivity from "@/mixins/currentActivity.js";
import {mapActions, mapState} from 'pinia'
import {useAllObjectivesStore} from "@/stores/allObjectives.js";
import { useUserProfileStore } from '@/stores/UserProfile.js'
import SideBarComponent from '@/components/SideBarComponent.vue'
import { useAuthStore } from '@/stores/Auth.js'
import { toast } from 'vue3-toastify'
import ToastOptions from '../../toasts/toastOptions.js'

export default {
  components: { SideBarComponent },
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
    ...mapState(useUserProfileStore, ['name']),
    ...mapState(useAllObjectivesStore, ['allObjectives']),
    ...mapState(useAuthStore, ['apiKey']),
  },
  methods: {
    ...mapActions(useAllObjectivesStore, ['setObjectives']),
    ...mapActions(useAuthStore, ['setApiKey']),
    ...mapActions(useUserProfileStore, ['setName']),
    logout() {
      location.reload()
      this.setApiKey(null)
      this.setName('')
    },
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
        this.timeEntries = resp.data.filter(entry => entry.end && entry.end.split(' ')[0] === new Date().toISOString().slice(0, 10));
        this.calcHoursWorked()
      }).catch((err) => {
        toast.error(`${err.response.data.errors} !`, ToastOptions);
      })
    },
    getProfile(){
      this.$api.get('profile').then((resp) => {
        this.user = resp.data.name
      }).catch(() => {
        toast.error('Erreur lors de la récupération du profil', ToastOptions);
      })
    }
  },
  created() {
    if (this.connected) {
      this.getProfile();
      this.$api.get(`daily-objectives?date=${new Date().toISOString().slice(0, 10)}`).then((resp) => {
        if (resp.data.length > 0) {
          this.setObjectives(resp.data)
          this.objectivesDone = this.allObjectives.filter((obj) => obj.done)
        }
      }).catch((err) => {
        toast.error(`${err.response.data.errors} !`, ToastOptions);
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
    },
    name() {
      this.user = this.name
    },

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
    <nav class="auth_link">
      <RouterLink to="/auth/login">Se connecter</RouterLink>
      <RouterLink to="/auth/register">S'inscrire</RouterLink>
    </nav>
  </header>

  <header v-if="connected">
    <div class="logo">
      <div>TIME</div>
      <div>LY</div>
    </div>
    <nav class="menu_link">
      <RouterLink to="/">Activité</RouterLink>
      <RouterLink to="/reporting">Statistiques</RouterLink>

      <SideBarComponent in-header position="left">
        <template #link>Paramètres</template>
        <template #content>
          <RouterLink class="item" to="/settings/profile">Mon Profil</RouterLink>
          <RouterLink class="item" to="/settings/activity">Activités</RouterLink>
          <RouterLink class="item" to="/settings/project">Projets</RouterLink>
          <p class="item" @click="logout">Déconnexion</p>
        </template>
      </SideBarComponent>
    </nav>
    <div class="profile">
    <RouterLink class="profile_link" active-class=""  to="/settings/profile">
      <div>{{ user }}</div>
      <img src="/icons/user.svg" alt="user icon">
    </RouterLink>
    </div>
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
  flex: 1;
  display: flex;
  font-size: 1.5em;
  font-weight: 500;

  div:nth-child(1) {
    color: #ECBA07;
  }
}

nav {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 2em;
}

a {
  color: inherit;
  text-decoration: none;
}

.auth_link {
  justify-content: flex-end;
}

.menu_link {
  justify-content: space-around;
}

.item {
  margin : 0;
  height: 15vh;
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  border-top: 1px solid #D4DFD8;
  border-bottom: 1px solid #D4DFD8;

  text-transform: uppercase;
  font-size: 1em;
  color: #D4DFD8;
  text-decoration: none;

  &:hover {
    background-color: rgba(0, 0, 0, 0.25);
    cursor: pointer;
  }
}

.profile {
  flex: 1;
  display: flex;
  gap: .5em;
  align-items: center;
  justify-content: flex-end;
  &_link {
    width: fit-content;
    display: flex;
    gap: .5em;
    align-items: center;
  }

  img {
    height: 1.5em;
  }
}

.greetings {
  flex: 1;
  text-align: center;
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
  padding: .5em 1em 1em;
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
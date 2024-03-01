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
      objectivesDone: []
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
        //compteurs d’objectifs atteints sur le total ouvert aujourd’hui
        this.allObjectives = resp.data
        this.objectivesDone = this.allObjectives.filter((obj) => obj.done)
      }).catch((err) => {
        console.log(err)
      })
      this.getCurrentActivity()
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

</style>
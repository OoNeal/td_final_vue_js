<script>
import {mapActions} from 'pinia'
import {useAuthStore} from '@/stores/Auth.js'

export default {
  props: {
    connected: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      user: ""
    }
  },
  created() {
    if (this.connected) {
      this.$api.get('profile')
          .then((response) => {
            this.user = response.data.name
          })
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

  <div class="current-activity" v-if="connected">

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
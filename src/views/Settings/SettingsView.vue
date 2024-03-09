<script>

import SideBarComponent from '@/components/SideBarComponent.vue'
import { mapActions } from 'pinia'
import { useAuthStore } from '@/stores/Auth.js'

export default {
  components: { SideBarComponent },
  data() {
    return {
      isSelected: false
    }
  },
  methods: {
    ...mapActions(useAuthStore, ['setApiKey']),
    logout() {
      this.setApiKey(null)
    }
  },
}
</script>

<template>
  <main>
    <div class="settings_sidebar">
      <SideBarComponent position="left">
        <template #button>Paramètres</template>
        <template #content>
          <RouterLink class="item" to="/settings/profile">Mon Profil</RouterLink>
          <RouterLink class="item" to="/settings/activity">Activités</RouterLink>
          <RouterLink class="item" to="/settings/project">Projets</RouterLink>
          <RouterLink class="item" @click="logout" to="/auth/login">Déconnexion</RouterLink>
        </template>
      </SideBarComponent>
    </div>
    <RouterView />
  </main>
</template>

<style scoped>
body {
  overflow: hidden;
}

.settings_sidebar {
  box-sizing: border-box;
  padding: 1em;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

main {
  width: 100vw;

  background-color: #212121;
}

.item {
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

.router-link-active {
  color: #ECBA07;
  text-decoration: underline 1px #ECBA07;
  font-weight: 500;
}

</style>
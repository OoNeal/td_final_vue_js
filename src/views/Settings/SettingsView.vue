<script>

import SideBarComponent from '@/components/SideBarComponent.vue'
import SideBarItemComponent from '@/components/SideBarItemComponent.vue'

export default {
  components: { SideBarComponent, SideBarItemComponent },
}
</script>

<template>
  <main>
    <div class="settings_sidebar">
      <SideBarComponent position="left">
        <template #button>Paramètres</template>
        <template #content>
          <SideBarItemComponent to="/settings/profile">Mon Profil</SideBarItemComponent>
          <SideBarItemComponent to="/settings/activity">Activités</SideBarItemComponent>
          <SideBarItemComponent to="/settings/project">Projets</SideBarItemComponent>
          <SideBarItemComponent is-logout to="/auth/login">Déconnexion</SideBarItemComponent>
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
  height: 100%;

  background-color: #212121;
}


</style>
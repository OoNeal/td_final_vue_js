<script>

import SidebarComponent from '@/components/Sidebar/SidebarComponent.vue'
import ItemComponent from '@/components/Sidebar/ItemComponent.vue'

export default {
  components: { SidebarComponent, ItemComponent }
}
</script>

<template>
  <main>
    <SidebarComponent direction="right">
      <ItemComponent to="/settings/profile">Profile</ItemComponent>
      <hr />
      <ItemComponent to="/settings/account">Account</ItemComponent>
      <hr />
      <ItemComponent to="/settings/notifications">Notifications</ItemComponent>
    </SidebarComponent>
  <RouterView />
  </main>
</template>

<style scoped>
main {
  width: 100vw;
  height: 90vh;

  display: flex;
  flex-direction: column;
  justify-content: center;

  background-color: #333333;
}
hr {
  width: 80%;
  margin: 0;
  border: 1px solid #808080;
}
</style>
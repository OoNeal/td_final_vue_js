<script >
import {RouterView } from 'vue-router'
import {Navigation} from '@/components/Navigation.vue'

export default {
  components: {
    RouterView,
    Navigation
  },
}
</script>

<template>
  <Navigation/>
  <RouterView />
</template>

<style scoped>
</style>

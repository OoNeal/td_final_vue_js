<script >
import {RouterView } from 'vue-router'
import Navigation from '@/components/NavigationComponent.vue'
import { useAuthStore } from '@/stores/Auth.js'


export default {
  methods: { useAuthStore },
  components: {
    RouterView,
    Navigation
  },
}
</script>

<template>
  <Navigation v-if="useAuthStore().apiKey"/>
  <RouterView />
</template>

<style scoped>
</style>

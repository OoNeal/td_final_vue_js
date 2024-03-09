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
  data() {
    return {
      apiKey: this.$api.defaults.headers['Authorization']
    }
  },
}
</script>

<template>
  <Navigation v-if="apiKey !== 'key=null' " connected/>
  <Navigation v-else/>
  <RouterView />
</template>

<style scoped>
</style>

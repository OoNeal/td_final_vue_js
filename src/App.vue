<script >
import {RouterView } from 'vue-router'
import Header from './components/header.vue'

export default {
  components: {
    RouterView,
    Header
  },
}
</script>

<template>
  <Header/>
  <RouterView />
</template>

<style scoped>
</style>

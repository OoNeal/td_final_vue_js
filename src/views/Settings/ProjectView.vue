<script>

import { defineComponent } from 'vue'
import ListItem from '@/components/ListItemComponent.vue'

export default defineComponent({
  components: { ListItem },
  methods: {
    getProjects() {
      this.$api.get('projects').then((resp) => {
        this.projects = resp.data.sort((a, b) => b.is_enabled - a.is_enabled)
      }).catch((err) => {
        console.log(err)
      })
    },
    getFilteredProjects() {
      this.$api.get('projects', { params: { keywords: this.keywords } }).then((resp) => {
        this.projects = resp.data
        console.log(this.projects)
      }).catch((err) => {
        console.log(err)
      })
    }
  },
  data() {
    return {
      projects: [],
      keywords: '',
    }
  },
  created() {
    this.getProjects()
  }
})
</script>

<template>
  <div>
    <h1>Mes Projets</h1>
    <input type="text" v-model="keywords" placeholder="Filtrer">
    <button @click="getFilteredProjects">Rechercher</button>
    <button @click="getProjects">Réinitialiser</button>
    <div class="row_container">
      <ListItem :is-project="true" @update-view="getProjects" :item="project" v-for="project in projects" :key="project.id"/>
    </div>
  </div>
</template>

<style scoped>

</style>
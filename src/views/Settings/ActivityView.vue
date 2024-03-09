<script>

import { defineComponent } from 'vue'
import ListItem from '@/components/ListItemComponent.vue'

export default defineComponent({
  components: { ListItem },
  methods: {
    getActivities() {
      this.$api.get('activities').then((resp) => {
        this.activities = resp.data.sort((a, b) => b.is_enabled - a.is_enabled)
      }).catch((err) => {
        console.log(err)
      })
    },
    getFilteredActivities() {
      this.$api.get('activities', { params: { keywords: this.keywords } }).then((resp) => {
        this.activities = resp.data
        console.log(this.activities)
      }).catch((err) => {
        console.log(err)
      })
    }
  },
  data() {
    return {
      activities: [],
      keywords: '',
    }
  },
  created() {
    this.getActivities()
  }
})
</script>

<template>
  <div>
    <h1>Mes Activités</h1>
    <input type="text" v-model="keywords" placeholder="Filtrer">
    <button @click="getFilteredActivities">Rechercher</button>
    <button @click="getActivities">Réinitialiser</button>
    <div class="row_container">
        <ListItem @update-view="getActivities" :item="activity" v-for="activity in activities" :key="activity.id"/>
    </div>
  </div>
</template>

<style scoped>

</style>
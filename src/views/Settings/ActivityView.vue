<script>

import {defineComponent} from 'vue'
import ListItem from '@/components/ListItemComponent.vue'

export default defineComponent({
  components: {ListItem},
  methods: {
    getActivities() {
      this.$api.get('activities').then((resp) => {
        this.activities = resp.data.sort((a, b) => b.is_enabled - a.is_enabled)
      }).catch((err) => {
        console.log(err)
      })
    },
    getFilteredActivities() {
      this.$api.get('activities', {params: {keywords: this.keywords}}).then((resp) => {
        this.activities = resp.data
      }).catch((err) => {
        console.log(err)
      })
    }
  },
  data() {
    return {
      activities: [],
      keywords: ''
    }
  },
  created() {
    this.getActivities()
  }
})
</script>

<template>
  <div class="activity">
    <div class="activity_header">
      <h1>Mes activités</h1>
      <hr/>
    </div>
    <div class="activity_filter">
      <input type="text" v-model="keywords" placeholder="Filtrer">
      <button @click="getFilteredActivities">Rechercher</button>
      <button @click="getActivities">Réinitialiser</button>
    </div>
    <div class="activity_container">
      <transition-group name="fade">
        <list-item @update-view="getActivities" :item="activity"
                   v-for="activity in activities" :key="activity.id"/>
      </transition-group>
    </div>
  </div>
</template>

<style scoped lang="scss">
.activity {
  width: 100vw;

  &_header {
    margin-bottom: 4em;
    padding-left: 2em;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    & > h1 {
      margin: 0;
      color: #D4DFD8;
      font-size: 2em;
      font-weight: 300;
      text-transform: uppercase;
    }

    & > hr {
      margin: 0;
      border: 1px solid #D4DFD8;
      width: 30%;
    }
  }

  &_filter {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 0.5em;

    & > input {
      width: 30%;
      padding: .5em 1em;

      border: 1px solid rgba(#D4DFD8, 0.35);
      border-radius: 100px;
      background-color: rgba(#D4DFD8, 0.2);

      font-family: 'Montserrat', sans-serif;
      color: #D4DFD8;
      font-size: 1em;
      font-weight: 400;
    }

    & > button {
      padding: 0.5em 2em;
      border: 1px solid rgba(#D4DFD8, 0.35);
      border-radius: 100px;
      background-color: rgba(#D4DFD8, 0.2);
      color: #D4DFD8;

      font-size: 1em;
      font-weight: 500;
    }
  }

  &_container {
    width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}
</style>
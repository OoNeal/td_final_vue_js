<script>
import Activity from '@/components/ActivityComponent.vue'

export default {
  components: {
    Activity
  },
  data() {
    return {
      timeEntries: [],
      currentDate: new Date().toISOString().slice(0, 10),
      activities: []
    }
  },
  directives: {
    color: {
      mounted(el, binding) {
        el.style.color = binding.value;
      }
    }
  },
  methods: {
    addActivity(id) {
      this.$api.get('activities/' + id).then((resp) => {
        this.activities.push(resp.data)
      })
    }
  },
  created() {
    //recupere les times entries du jour
    this.$api.get('time-entries?from' + this.currentDate + '&to' + this.currentDate).then((resp) => {
      console.log("les times entries du jour", resp.data)
      this.timeEntries = resp.data
      //de la, on recup les id des activités qui ont une time entry a ce jour (et qui donc ont été réalisées à ce jour)
      //puis on recup les activités correspondantes
      resp.data.forEach(element => {
        console.log(this.activities.includes(element.activity_id))
        this.addActivity(element.activity_id)
      });
    })
  },
}
</script>

<template>
  {{ activities }}
  <div class="activities">
    <div class="activity" v-for="activity in activities" :key="activity.id">
      <Activity v-color="activity.color" :name="activity.name"/>
    </div>
  </div>

</template>

<style scoped>

</style>

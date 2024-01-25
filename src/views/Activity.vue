<script>
import Activity from '@/components/Activity.vue'

export default {
  components: {
    Activity
  },
  data() {
    return {
      activities: []
    }
  },
  methods: {
  },
  directives : {
    color: {
      mounted(el, binding) {
        el.style.color = binding.value;
      }
    }
  },
  created() {
    this.$api.get('activities').then((resp) => {
      console.log(resp.data)
      this.activities = resp.data
    })
  },
}
</script>

<template>
  <div class="activities">
    <div class="activity" v-for="activity in activities" :key="activity.id">
      <Activity v-color="activity.color" :name="activity.name"/>
    </div>
  </div>

</template>

<style scoped>

</style>

<script>

export default {
  props: {
    activityId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    entries : {
      type: Array,
      required: true
    },
    color : {
      type: String,
      required: false
    }
  },
  data() {
    return {
      //beingChanged : false
    }
  },
  methods : {
    //TODO : edit entry
    //todo : add entry
    getHours(date) {
      let time = date.split(" ")[1]
      return time.split(":")[0] + "h" + time.split(":")[1]
    },
    deleteEntry(entryId) {
      this.$api.delete('time-entries/' + entryId).then((resp) => {
        this.entries.forEach(entry => {
          if (entry.id === entryId) {
            this.entries.splice(this.entries.indexOf(entry), 1)
          }
        })
      })
    },
    editEntry(entryId) {
      // TODO : endit entry
    }
  },
  directives: {
    color: {
      mounted(el, binding) {
        el.style.color = binding.value;
      }
    }
  }
}
</script>

<template>
  <div class="daily-activity">
    <div v-color="color">{{name}}</div>
    <div v-for="entry in entries"  :key="entry.id">
      <div v-if="entry.activity_id === activityId">de {{getHours(entry.start)}} à {{getHours(entry.end)}}</div>
      <img v-if="entry.activity_id === activityId" @click="deleteEntry(entry.id)" src="@/assets/icons/delete.svg" alt="trash icon">
    </div>



  </div>
</template>

<style scoped>

</style>


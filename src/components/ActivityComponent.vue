<script>

export default {
  emits: ['updateEntries'],
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
      /*newEntry : {
        beingChanged: false,
        id: null,
        activity_id: null,
        project_id: null,
        comment: null,
        start: null,
        end: null
      },*/
      newEntry : null
    }
  },
  methods : {
    getHours(date) {
      let time = date.split(" ")[1]
      return time.split(":")[0] + "h" + time.split(":")[1]
    },
    deleteEntry(entryId) {
      this.$api.delete('time-entries/' + entryId).then(() => {
        //ça supp que au reload et pas direct
        this.entries.filter(entry => entry.id !== entryId);
        this.$emit('update-entries')
      })
    },
    changeEntry(entryId) {
      this.newEntry = {...this.entries.find(entry => entry.id === entryId)};
      this.newEntry.beingChanged = true
      this.$emit('update-entries')
    },
    editEntry(entryId) {
      this.$api.put('time-entries/' + entryId, {
        project_id: this.newEntry.project_id,
        activity_id: this.newEntry.activity_id,
        start : this.newEntry.start,
        end : this.newEntry.end,
        comment: this.newEntry.comment
      }).then((resp) => {
        //this.entries.map(entry => entry.id !== entryId ? entry : resp.data);
        //console.log(this.entries)
        this.newEntry = null
        this.$emit('update-entries')
      }).catch((err) => {
        console.log(err.response.data.errors)
      })
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
      <img v-if="entry.activity_id === activityId" @click="changeEntry(entry.id)" src="@/assets/icons/edit.svg" alt="edit icon">
      <img v-if="entry.activity_id === activityId" @click="deleteEntry(entry.id)" src="@/assets/icons/delete.svg" alt="trash icon">
    </div>
  </div>

  <div class="change-entry" v-if="newEntry !== null">
    <input type="datetime-local" v-model="newEntry.start">
    <input type="datetime-local" v-model="newEntry.end">
    <input type="text" v-model="newEntry.comment">
    <button @click="editEntry(newEntry.id)">Valider</button>
  </div>
</template>

<style scoped>
.change-entry {
  border: 2px solid fuchsia;
}
</style>


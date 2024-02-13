<script>

export default {
  emits: ['updateEntries'],
  props: {
    entry:{
      type: Object,
      required: true
    }
  },
  data() {
    return {
      newEntry : null,
      project: "",
      activity: "",
      color: ""
    }
  },
  created() {
    this.$api.get(`projects/${this.entry.project_id}`).then((resp) => {
      this.project = resp.data.name
    })
    this.$api.get(`activities/${this.entry.activity_id}`).then((resp) => {
      this.activity = resp.data.name
      this.color = resp.data.color
    })
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
    changeEntry() {
      this.newEntry = this.entry;
      this.newEntry.beingChanged = true
      this.$emit('update-entries')
    },
    editEntry() {
      this.$api.put(`time-entries/${this.entry.id}`, {
        project_id: this.newEntry.project_id,
        activity_id: this.newEntry.activity_id,
        start : this.newEntry.start,
        end : this.newEntry.end,
        comment: this.newEntry.comment
      }).then(() => {
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
  <div class="entry">
    <div>{{project}}</div>
    <div v-color="color">{{activity}}</div>
    <div>{{getHours(entry.start)}} - {{getHours(entry.end)}}</div>
    <div>{{entry.comment}}</div>
    <img @click="changeEntry()" src="@/assets/icons/edit.svg" alt="edit icon">
    <img @click="deleteEntry()" src="@/assets/icons/delete.svg" alt="trash icon">
  </div>

  <div class="change-entry" v-if="newEntry !== null">
    <input type="datetime-local" v-model="newEntry.start">
    <input type="datetime-local" v-model="newEntry.end">
    <input type="text" v-model="newEntry.comment">
    <button @click="editEntry()">Valider</button>
  </div>
</template>

<style scoped>
.change-entry {
  border: 2px solid fuchsia;
}
</style>


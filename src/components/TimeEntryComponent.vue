<script>

export default {
  emits: ['update-entries'],
  props: {
    entry: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      newEntry: null,
      project: "",
      activity: "",
      color: ""
    }
  },
  created() {
    this.$api.get(`projects/${this.entry.project_id}`).then((resp) => {
      this.project = resp.data.name
    }).catch((err) => {
      console.log(err)
    })
    this.$api.get(`activities/${this.entry.activity_id}`).then((resp) => {
      this.activity = resp.data.name
      this.color = resp.data.color
      console.log(this.color)
    }).catch((err) => {
      console.log(err)
    })
  },
  computed: {
    calcHoursBetween() {
      //ressemble à calcHoursWorked dans NavigationComponent.vue
      let totalMillisecondsWorked = 0;
      const start = new Date(this.entry.start);
      const end = new Date(this.entry.end);
      totalMillisecondsWorked += end.getTime() - start.getTime();
      const hoursWorked = Math.floor(totalMillisecondsWorked / (1000 * 60 * 60));
      const minutesWorked = Math.floor((totalMillisecondsWorked % (1000 * 60 * 60)) / (1000 * 60));
      let timeWorked = "";
      hoursWorked ? timeWorked = hoursWorked + "h" + minutesWorked : timeWorked = minutesWorked + "min";
      return timeWorked;
    }
  },
  methods: {
    getHours(date) {
      let time = date.split(" ")[1]
      return time.split(":")[0] + "h" + time.split(":")[1]
    },
    deleteEntry() {
      this.$api.delete('time-entries/' + this.entry.id).then(() => {
        this.$emit('update-entries')
      }).catch((err) => {
        console.log(err)
      })
    },
    changeEntry() {
      this.newEntry = {...this.entry};
      this.newEntry.beingChanged = true
    },
    editEntry() {
      this.$api.put(`time-entries/${this.entry.id}`, {
        project_id: this.newEntry.project_id,
        activity_id: this.newEntry.activity_id,
        start: this.newEntry.start,
        end: this.newEntry.end,
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
      updated(el, binding) {
        el.style.color = binding.value;
      }
    },
    border: {
      updated(el, binding) {
        el.style.borderColor = binding.value;
      }
    }

  }
}
</script>

<template>
  <div v-border="color" class="entry">
    <div class="top">
      <div class="project">{{ project }}</div>
      <div class="activity" v-color="color">{{ activity }}</div>
    </div>
    <div class="infos-1">
      <div>{{ getHours(entry.start) }} - {{ getHours(entry.end) }} ({{ calcHoursBetween }})</div>
      <div class="actions-icons">
        <img @click="changeEntry()" src="/icons/editOrange.svg" alt="edit icon">
        <img @click="deleteEntry()" src="/icons/deleteOrange.svg" alt="trash icon">
      </div>
    </div>
    <div class="infos-2">{{ entry.comment }}</div>
  </div>

  <div class="change-entry" v-if="newEntry !== null">
    <input type="datetime-local" v-model="newEntry.start">
    <input type="datetime-local" v-model="newEntry.end">
    <input type="text" v-model="newEntry.comment">
    <button @click="editEntry()">Valider</button>
  </div>
</template>

<style scoped lang="scss">
.entry {
  border: 0.05em solid #D4DFD8;
  border-radius: 10px;
  color: #D4DFD8;
  background-color: #323333;
  padding: .5em 1em;
}

.top {
  text-align: center;

  .project {
    font-weight: 650;
    text-transform: uppercase;
  }
}

.infos-1 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1em;
  font-weight: 300;
  margin-top: .5em;
  margin-bottom: .5em;
  color: darken(#D4DFD8, 10%);
}

.actions-icons {
  display: flex;
  gap: 1em;

  img {
    height: 1.3em;
  }
}

.infos-2 {
  font-weight: 100;
  color: darken(#D4DFD8, 20%);
}


.change-entry {
  border: 2px solid fuchsia;
}
</style>


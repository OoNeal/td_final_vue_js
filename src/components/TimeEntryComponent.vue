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
    <div v-if="!newEntry" class="infos-1">
      <div>{{ getHours(entry.start) }} - {{ getHours(entry.end) }} ({{ calcHoursBetween }})</div>
      <div class="actions-icons">
        <img @click="changeEntry()" src="/icons/editOrange.svg" alt="edit icon">
        <img @click="deleteEntry()" src="/icons/deleteOrange.svg" alt="trash icon">
      </div>
    </div>
    <div v-if="!newEntry" class="infos-2">{{ entry.comment }}</div>

    <div class="change-entry" v-else>
      <div class="input">
        <label for="start">Début :</label>
        <input name="start" type="datetime-local" v-model="newEntry.start">
      </div>
      <div class="input">
        <label for="end">Fin :</label>
        <input name="end" type="datetime-local" v-model="newEntry.end">
      </div>
      <label for="comment">Commentaire :</label>
      <input name="comment" type="text" v-model="newEntry.comment">

      <div class="buttons">
        <button @click="newEntry = null">Annuler</button>
        <button @click="editEntry()">Valider</button>
      </div>
    </div>
  </div>

</template>

<style scoped lang="scss">
.entry {
  border: 0.05em solid #D4DFD8;
  border-radius: 10px;
  color: #D4DFD8;
  background-color: #323333;
  padding: .5em 1em;
  margin-top: 1em;
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
  font-weight: 350;
  margin-top: .5em;
  margin-bottom: .5em;
  color: darken(#D4DFD8, 10%);
}

.actions-icons {
  display: flex;
  gap: 1em;

  img {
    height: 1.3em;
    cursor: pointer;
  }
}

.infos-2 {
  font-weight: 200;
  color: darken(#D4DFD8, 20%);
}


.change-entry {
  //background-color: blue;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin-top: 1em;
  margin-bottom: .5em;
  padding-left: 5%;
  padding-right: 5%;

  label {
    font-weight: 550;
  }

  input {
    cursor: pointer;
    padding: .5em 1em;
    font-family: inherit;
    border-radius: 10px;
    border: none;
    background-color: unset;
    color: #D4DFD8;
    font-size: .9em;
    text-overflow: ellipsis;
    font-weight: 300;


    &[type=text] {
      cursor: text;
      background-color: darken(#323333, 5%);
      border: 1px solid #636765;
      width: inherit;
      margin-top: .5em;
    }
  }

  .buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 1em;

    button:nth-child(1) {
      appearance: none;
      border: none;
      background: none;
      color: #ECBA07;
      font-size: 1em;
      font-weight: 200;
      text-decoration: underline;
      text-underline-offset: 4px;

      &:hover {
        color: darken(#ECBA07, 7%)
      }
    }

    button:nth-child(2) {
      padding: .5em 1em;
      border-radius: 10px;
      border: none;
      background-color: #ECBA07;
      font-weight: 500;
      font-size: .9em;

      &:hover {
        background-color: darken(#ECBA07, 3%)
      }
    }

  }


}
</style>


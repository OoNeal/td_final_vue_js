<script>
import Activity from '@/components/ActivityComponent.vue'
//TODO : penser à disable les projets et les activités concernées quand la time entry se finit ?
export default {
  components: {
    Activity
  },
  data() {
    return {
      timeEntriesToday: [],
      currentDate: new Date().toISOString().slice(0, 10),
      currentTimeEntry: [],
      timer: "",
      activitiesToday: [],
      enabledActivities: [],
      enabledProjects: [],
      newActivityData: {
        creating: false,
        name: "",
        color: ""
      },
      newProjectData: {
        creating: false,
        name: "",
        description: ""
      },
      newTimeEntryData: {
        activity_id: "",
        project_id: "",
        comment: ""
      },
      createTimeEntryData: {
        activity_id: "",
        project_id: "",
        comment: "",
        start: "",
        end: ""
      }
    }
  },
  created() {
    console.log(new Date().toLocaleString().replace(" ", "T").replaceAll("/", "-"))
    //on récup l'activité en cours (time entry en cours, qui n'a pas de fin)
    this.$api.get('time-entries?end=').then((resp) => {
      this.currentTimeEntry = resp.data
    })

    //recupere les times entries du jour
    this.$api.get('time-entries?from=' + this.currentDate + '&to=' + this.currentDate).then((resp) => {
      this.timeEntriesToday = resp.data
      let activtyIds = []
      //de la, on recup les id des activités qui ont une time entry a ce jour (et qui donc ont été réalisées à ce jour)
      //puis on recup les infos des activités correspondantes
      resp.data.forEach(element => {
        if (!activtyIds.includes(element.activity_id)) {
          activtyIds.push(element.activity_id)
          this.getActivityToday(element.activity_id)
        }
      });
    })

    //on récup toutes les activités et tous les projets QUI SONT ENABLED pr pouvoir afficher select pour créer une time entry
    //cf Ajouter une activité
    this.$api.get('activities?is_enabled=1').then((resp) => {
      this.enabledActivities = resp.data
    })
    this.$api.get('projects?is_enabled=1').then((resp) => {
      this.enabledProjects = resp.data
    })
    window.setInterval(() => {
      this.calcTimeSince()
    }, 1000)
  },
  methods: {
    calcTimeSince() {
      if (this.currentTimeEntry.length !== 0) {
        const date = new Date(this.currentTimeEntry[0].start);
        const difference = new Date().getTime() - date.getTime();
        const jours = Math.floor(difference / (1000 * 60 * 60 * 24));
        const heures = Math.floor(difference / (1000 * 60 * 60));
        let minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        let secondes = Math.floor((difference % (1000 * 60)) / 1000);
        if (secondes < 10) {
          secondes = '0' + secondes;
        }
        if (minutes < 10) {
          minutes = '0' + minutes;
        }
        if (jours !== 0) {
          this.timer = jours + "j " + heures + "h " + minutes + "m " + secondes + "s"
        } else {
          this.timer = heures + ":" + minutes + ":" + secondes
        }
      }
    },
    getHours(date) {
      let time = date.split(" ")[1]
      return time.split(":")[0] + "h" + time.split(":")[1]
    },
    getActivityToday(id) {
      //utilisé pour récup les infos sur les activités qui ont une time entry à ce jour
      this.$api.get('activities/' + id).then((resp) => {
        this.activitiesToday.push(resp.data)
      })
    },
    popup(arg) {
      if (arg === 1) {
        this.newActivityData.creating = !this.newActivityData.creating
      } else if (arg === 2) {
        this.newProjectData.creating = !this.newProjectData.creating
      }
    },
    createActivity() {
      this.$api.post('activities', {
        name: this.newActivityData.name,
        color: this.newActivityData.color
      }).then((resp) => {
        this.enabledActivities.push(resp.data)
        this.newActivityData.creating = false
      }).catch((err) => {
        console.log(err.response.data.errors)
      })
    },
    createProject() {
      this.$api.post('projects', {
        name: this.newProjectData.name,
        description: this.newProjectData.description
      }).then((resp) => {
        this.enabledProjects.push(resp.data)
        this.newProjectData.creating = false
      }).catch((err) => {
        console.log(err.response.data.errors)
      })
    },
    createTimeEntry() {
      if (this.createTimeEntryData.activity_id !== "" || this.createTimeEntryData.project_id !== "") {
        this.$api.post('time-entries', {
          project_id: this.createTimeEntryData.project_id,
          activity_id: this.createTimeEntryData.activity_id,
          comment: this.createTimeEntryData.comment,
          start: this.createTimeEntryData.start,
          end: this.createTimeEntryData.end
        }).then((resp) => {
          this.createTimeEntryData.activity_id = ""
          this.createTimeEntryData.project_id = ""
          this.createTimeEntryData.comment = ""
          this.createTimeEntryData.start = ""
          this.createTimeEntryData.end = ""
        }).catch((err) => {
          console.log(err.data)
        })
      }
    },
    startActivity() {
      //quasi la même que le createTimeEntry sauf que modif de currentTimeEntry + this.calcTimeSince(
      if (this.newTimeEntryData.activity_id !== "" || this.newTimeEntryData.project_id !== "") {
        this.$api.post('time-entries', {
          project_id: this.newTimeEntryData.project_id,
          activity_id: this.newTimeEntryData.activity_id,
          comment: this.newTimeEntryData.comment
        }).then((resp) => {
          this.currentTimeEntry[0] = resp.data
          this.calcTimeSince()
          this.newTimeEntryData.activity_id = ""
          this.newTimeEntryData.project_id = ""
          this.newTimeEntryData.comment = ""
        }).catch((err) => {
          console.log(err.data)
        })
      }
    },
    stopActivity() {
      this.$api.patch(`time-entries/${this.currentTimeEntry[0].id}/stop`).then((resp) => {
        this.currentTimeEntry = []
        this.timeEntriesToday.push(resp.data)
      }).catch((err) => {
        console.log(err.response.data)
      })
    }
  }
}
</script>

<template>
  <div class="current-activity">
    <div v-if="currentTimeEntry.length !== 0">
      <h2>Activité en cours : </h2>
      <div>Timer : {{ timer }}</div>
      <button @click="stopActivity()">Arrêter</button>
    </div>
    <div v-else>
      <h2> pas de acti en cours donc : Ajouter une activité : </h2>
      <div>
        <select v-model="newTimeEntryData.project_id" name="activity">
          <option value="" selected disabled>Projet concerné</option>
          <option v-for="project in enabledProjects" :key="project.id" :value="project.id">{{ project.name }}</option>
        </select>
        <button v-if="!newActivityData.creating" @click="popup(1)">Nouvelle activité</button>
      </div>
      <div>
        <select v-model="newTimeEntryData.activity_id" name="project">
          <option value="" selected disabled>Type d'activité</option>
          <option v-for="activity in enabledActivities" :key="activity.id" :value="activity.id">{{activity.name }}</option>
        </select>
        <button v-if="!newProjectData.creating" @click="popup(2)">Nouveau projet</button>
      </div>
      <div>
        <input v-model="newTimeEntryData.comment" type="text" name="commentaire" placeholder="Commentaire">
      </div>
      <button @click="startActivity()">Lancer</button>
    </div>
  </div>
  <div id="popupNewActivity" v-if="newActivityData.creating">
    <div>Nouvelle activité :</div>
    <div @click="popup(1)" class="close">ANNULER</div>
    <input type="text" v-model="newActivityData.name" placeholder="Nom de l'activité">
    <input type="color" v-model="newActivityData.color">
    <button @click="createActivity()">Créer l'activité</button>
  </div>
  <div id="popupNewProject" v-if="newProjectData.creating">
    <div>Nouveau projet :</div>
    <div @click="popup(2)" class="close">ANNULER</div>
    <input type="text" v-model="newProjectData.name" placeholder="Nom de du projet">
    <input type="text" v-model="newProjectData.description" placeholder="Description du projet">
    <button @click="createProject()">Créer le projet</button>
  </div>

  <h2> Liste des activités réalisées ajrd : </h2>
  <div>
    <h2>Créer une entrée : </h2>
    <div>
      <select v-model="createTimeEntryData.project_id" name="activity">
        <option value="" selected disabled>Projet concerné</option>
        <option v-for="project in enabledProjects" :key="project.id" :value="project.id">{{ project.name }}</option>
      </select>
      <button v-if="!createTimeEntryData.creating" @click="popup(1)">Nouvelle activité</button>
    </div>
    <div>
      <select v-model="createTimeEntryData.activity_id" name="project">
        <option value="" selected disabled>Type d'activité</option>
        <option v-for="activity in enabledActivities" :key="activity.id" :value="activity.id">{{activity.name }}</option>
      </select>
      <button v-if="!createTimeEntryData.creating" @click="popup(2)">Nouveau projet</button>
    </div>
    <div>
      <input v-model="createTimeEntryData.comment" type="text" name="commentaire" placeholder="Commentaire">
    </div>
    <div>
      <input v-model="createTimeEntryData.start" type="datetime-local"  name="start">
      <input v-model="createTimeEntryData.end" type="datetime-local" name="end">
    </div>
    <button @click="createTimeEntry()">Ajouter</button>
  </div>
  <div class="activities">
    <Activity v-for="activity in activitiesToday" :key="activity.id" :color="activity.color" :activityId="activity.id"
              :name="activity.name" :entries="timeEntriesToday"/>
  </div>
</template>

<style scoped>

</style>

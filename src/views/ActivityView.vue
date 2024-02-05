<script>
import Activity from '@/components/ActivityComponent.vue'
//TODO : penser à disable les projets et les activités concernées quand la time entry se finit !
export default {
  components: {
    Activity
  },
  data() {
    return {
      allTimeEntries: [],
      currentDate: new Date().toISOString().slice(0, 10),
      currentTimeEntry: [],
      activitiesToday: [],
      allActivities: [],
      allProjects: [],
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
      }
    }
  },
  created() {
    //recupere les times entries du jour
    this.$api.get('time-entries?from=' + this.currentDate + '&to=' + this.currentDate).then((resp) => {
      this.allTimeEntries = resp.data
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

    //on récup toutes les activités et tous les projets pr pouvoir afficher select pour créer une time entry
    //cf Ajouter une activité
    this.$api.get('activities').then((resp) => {
      this.allActivities = resp.data
    })
    this.$api.get('projects').then((resp) => {
      this.allProjects = resp.data
    })
  },
  methods: {
    getActivityToday(id) {
      //utilisé pour récup les infos sur les activités qui ont une time entry à ce jour
      this.$api.get('activities/' + id).then((resp) => {
        this.activitiesToday.push(resp.data)
      })
    },
    popupActivity() {
      this.newActivityData.creating = !this.newActivityData.creating
    },
    popupProject() {
      this.newProjectData.creating = !this.newProjectData.creating
    },
    createActivity() {
      this.$api.post('activities', {
        name: this.newActivityData.name,
        color: this.newActivityData.color
      }).then((resp) => {
        this.allActivities.push(resp.data)
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
        this.allProjects.push(resp.data)
        this.newProjectData.creating = false
      }).catch((err) => {
        console.log(err.response.data.errors)
      })
    },
    startActivity() {
      if (this.newTimeEntryData.activity_id !== "" || this.newTimeEntryData.project_id !== "") {
        this.$api.post('time-entries', {
          project_id: this.newTimeEntryData.project_id,
          activity_id: this.newTimeEntryData.activity_id,
          comment: this.newTimeEntryData.comment
        }).then((resp) => {
          console.log(resp.data)
          this.newTimeEntryData.activity_id = ""
          this.newTimeEntryData.project_id = ""
          this.newTimeEntryData.comment = ""
        }).catch((err) => {
          console.log(err.response.data.errors)
        })
      }
    }
  }
}
</script>

<template>
  <div id="popupNewActivity" v-if="newActivityData.creating">
    <div>Nouvelle activité :</div>
    <div @click="popupActivity()" class="close">ANNULER</div>
    <input type="text" v-model="newActivityData.name" placeholder="Nom de l'activité">
    <input type="color" v-model="newActivityData.color">
    <button @click="createActivity()">Créer l'activité</button>
  </div>
  <div id="popupNewProject" v-if="newProjectData.creating">
    <div>Nouveau projet :</div>
    <div @click="popupProject()" class="close">ANNULER</div>
    <input type="text" v-model="newProjectData.name" placeholder="Nom de du projet">
    <input type="text" v-model="newProjectData.description" placeholder="Description du projet">
    <button @click="createProject()">Créer le projet</button>
  </div>
  <div>
    <h2>Ajouter une activité : </h2>
    <div>
      <select v-model="newTimeEntryData.project_id" name="activity">
        <option value="" selected disabled>Projet concerné</option>
        <option v-for="project in allProjects" :key="project.id" :value="project.id">{{ project.name }}</option>
      </select>
      <button v-if="!newActivityData.creating" @click="popupActivity()">Nouvelle activité</button>
    </div>
    <div>
      <select v-model="newTimeEntryData.activity_id" name="project">
        <option value="" selected disabled>Type d'activité</option>
        <option v-for="activity in allActivities" :key="activity.id" :value="activity.id">{{ activity.name }}</option>
      </select>
      <button v-if="!newProjectData.creating" @click="popupProject()">Nouveau projet</button>
    </div>
    <div>
      <input v-model="newTimeEntryData.comment" type="text" name="commentaire" placeholder="Commentaire">
    </div>
    <button @click="startActivity()">Lancer</button>
    <div>{{ newTimeEntryData }}</div>
  </div>
  <h2> Liste des activités réalisées ajrd : </h2>
  <div class="activities">
    <Activity v-for="activity in activitiesToday" :key="activity.id" :color="activity.color" :activityId="activity.id" :name="activity.name" :entries="allTimeEntries"/>
  </div>
</template>

<style scoped>

</style>

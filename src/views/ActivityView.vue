<script>
import TimeEntry from "@/components/TimeEntryComponent.vue";
import PopUp from "@/components/PopUpComponent.vue";

export default {
  components: {
    TimeEntry,
    PopUp
  },
  data() {
    return {
      timeEntriesToday: [],
      currentDate: new Date().toISOString().slice(0, 10),
      currentTimeEntry: [],
      timer: "",

      //mettre tous les projets et activités ds les filtres
      allProjects: [],
      allActivities: [],

      //pr afficher seulement les projets et actis enabled dans les selects pr lancer un timer
      enabledActivities: [],
      enabledProjects: [],

      //tous les projets (ceux qui n'ont pas été atteint aussi) et les projects atteints
      allObjectives: [],
      displayObjectives: [],
      showObjectivesDone: false,
      //pour chercher un objectif
      objectiveSearch: "",

      //création activité
      newActivityData: {
        creating: false,
        name: "",
        color: ""
      },

      //création projet
      newProjectData: {
        creating: false,
        name: "",
        description: ""
      },

      //lancer le timer = nvelle timeEntry
      newTimeEntryData: {
        activity_id: "",
        project_id: "",
        comment: ""
      },

      //création timeEntry
      createTimeEntryData: {
        creating: false,
        activity_id: "",
        project_id: "",
        comment: "",
        start: "",
        end: ""
      },

      //création objectif
      newObjectiveData: {
        creating: false,
        name: "",
        description: ""
      },

      filters: {
        project_id: "",
        activity_id: "",
        comment: ""
      },
      errors: []
    }
  },
  watch: {
    objectiveSearch() {
      console.log(this.objectiveSearch)
      this.displayObjectives = this.allObjectives.filter(objective => objective.name.includes(this.objectiveSearch))
    },
  },
  created() {
    //on récup l'activité en cours (time entry en cours, qui n'a pas de fin)
    this.$api.get('time-entries?end=').then((resp) => {
      this.currentTimeEntry = resp.data
    })

    this.getTimeEntriesToday()

    this.$api.get('activities').then((resp) => {
      this.allActivities = resp.data
      this.enabledActivities = resp.data.filter(activity => activity.is_enabled === 1);
    })
    this.$api.get('projects').then((resp) => {
      this.allProjects = resp.data
      this.enabledProjects = resp.data.filter(project => project.is_enabled === 1);
    })
    this.$api.get('daily-objectives').then((resp) => {
      this.allObjectives = resp.data
      console.log(this.allObjectives)
      this.displayObjectives = resp.data.filter(objective => objective.done === 0);
      console.log(this.displayObjectives)
    })
    window.setInterval(() => {
      this.calcTimeSince()
    }, 1000)
  },
  methods: {
    getTimeEntriesToday() {
      this.$api.get('time-entries?from=' + this.currentDate + '&to=' + this.currentDate).then((resp) => {
        this.timeEntriesToday = resp.data
      })
    },
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
    createActivity() {
      this.$api.post('activities', {
        name: this.newActivityData.name,
        color: this.newActivityData.color
      }).then((resp) => {
        this.enabledActivities.push(resp.data)
        this.allActivities.push(resp.data)
        this.newActivityData.creating = false
      }).catch((err) => {
        console.log(err.response.data.errors)
        this.errors.push(err)
      })
    },
    createProject() {
      this.$api.post('projects', {
        name: this.newProjectData.name,
        description: this.newProjectData.description
      }).then((resp) => {
        this.enabledProjects.push(resp.data)
        this.allProjects.push(resp.data)
        this.newProjectData.creating = false
      }).catch((err) => {
        console.log(err.response.data.errors)
      })
    },
    createObjective() {
      this.$api.post('daily-objectives', {
        name: this.newObjectiveData.name,
        content: this.newObjectiveData.description
      }).then((resp) => {
        this.newObjectiveData.creating = false
        this.objectives.push(resp.data)
      }).catch((err) => {
        console.log(err.response.data.errors)
      })
    },
    showAllObjectives() {
      this.showObjectivesDone = true
      this.displayObjectives = this.allObjectives
    },
    hideObjectivesDone() {
      this.showObjectivesDone = false
      this.displayObjectives = this.allObjectives.filter(objective => objective.done === 0);
    },
    createTimeEntry() {
      if (this.createTimeEntryData.activity_id !== "" || this.createTimeEntryData.project_id !== "") {
        this.$api.post('time-entries', {
          project_id: this.createTimeEntryData.project_id,
          activity_id: this.createTimeEntryData.activity_id,
          comment: this.createTimeEntryData.comment,
          start: this.createTimeEntryData.start.replace("T", " "),
          end: this.createTimeEntryData.end.replace("T", " ")
        }).then((resp) => {
          // TODO : push dans activitiesToday si la date de début et de fin c ajrd
          console.log("createTimeEntry", resp.data)
          //this.activitiesToday.push(resp.data)
          this.createTimeEntryData.activity_id = ""
          this.createTimeEntryData.project_id = ""
          this.createTimeEntryData.comment = ""
          this.createTimeEntryData.start = ""
          this.createTimeEntryData.end = ""
          this.getTimeEntriesToday()
        }).catch((err) => {
          console.log(err)
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
        // ça push bien quand on a déjà des entries sur l'activité
        this.getTimeEntriesToday()
        this.currentTimeEntry = []
      }).catch((err) => {
        console.log(err.response.data)
      })
    },
    filterEntries() {

    },
    deleteFilters() {
      this.filters.project_id = ""
      this.filters.activity_id = ""
      this.filters.comment = ""
    },
  },
}
</script>

<template>

  <div v-if="currentTimeEntry.length > 0" class="current-activity">
    <h1>En cours :</h1>
    <div class="timer">{{ timer }}</div>
    <div class="">Nom de l'activité</div>
    <div class="">Nom du projet</div>
    <button @click="stopActivity">STOP</button>
  </div>

  <div v-else class="start-activity">
    <h1>Lancer une activité :</h1>
    <div class="select-project">
      <select v-model="newTimeEntryData.project_id" name="activity">
        <option value="" selected disabled>Projet concerné</option>
        <option v-for="project in enabledProjects" :key="project.id" :value="project.id">{{ project.name }}</option>
      </select>
      <button v-if="!newProjectData.creating" @click="newProjectData.creating = true">Nouveau projet</button>
    </div>
    <div class="select-activity">
      <select v-model="newTimeEntryData.activity_id" name="project">
        <option value="" selected disabled>Type d'activité</option>
        <option v-for="activity in enabledActivities" :key="activity.id" :value="activity.id">{{ activity.name }}
        </option>
      </select>
      <button v-if="!newActivityData.creating" @click="newActivityData.creating = true">Nouvelle activité</button>
    </div>
    <div class="select-comment">
      <input v-model="newTimeEntryData.comment" type="text" name="commentaire" placeholder="Commentaire">
    </div>
    <button @click="startActivity">Lancer</button>
  </div>

  <div class="activities">
    <h2>Vos activités du jour :</h2>
    <button @click="createTimeEntryData.creating = !createTimeEntryData.creating">Créer une entrée</button>

    <div class="activities-list">
      <div class="filters">
        Filtrer la liste :
        <select v-model="filters.project_id" name="filter-project">
          <option value="" selected disabled>Projet concerné</option>
          <option v-for="project in allProjects" :key="project.id" :value="project.id">{{ project.name }}</option>
        </select>
        <select v-model="filters.activity_id" name="filter-activity">
          <option value="" selected disabled>Activité concernée</option>
          <option v-for="activity in allActivities" :key="activity.id" :value="activity.id">{{ activity.name }}</option>
        </select>
        <input v-model="filters.comment" type="text" name="commentaire"
               placeholder="Commentaire">
        <button @click="deleteFilters">Supp les filtres</button>
      </div>
      <time-entry @update-entries="getTimeEntriesToday" v-for="entry in timeEntriesToday" :key="entry.id"
                  :entry="entry"/>
    </div>
  </div>

  <div class="objectives">
    <h2>Vos objectifs : </h2>
    {{ objectiveSearch }}
    <input type="text" v-model="objectiveSearch" placeholder="Rechercher un objectif">
    <button @click="newObjectiveData.creating = true">Créer un objectif</button>
    <div v-if="displayObjectives.length > 0" class="objectives-list">
      <button v-if="!showObjectivesDone" @click="showAllObjectives">Voir aussi les objectifs atteints</button>
      <button v-else @click="hideObjectivesDone">Cacher les objectifs atteints</button>
      <div v-for="objective in displayObjectives" class="objective" :key="objective.id">
        {{ objective.name }}
        {{ objective.content }}
      </div>
    </div>
    <div v-else>
      <p>Vous n'avez aucun objectif.</p>
    </div>
  </div>

  <pop-up @close="newActivityData.creating = false" id="popupNewActivity" v-if="newActivityData.creating">
    <div>Nouvelle activité :</div>
    <input type="text" v-model="newActivityData.name" placeholder="Nom de l'activité">
    <input type="color" v-model="newActivityData.color">
    <button @click="createActivity">Créer l'activité</button>
  </pop-up>
  <pop-up @close="newProjectData.creating = false" id="popupNewProject" v-if="newProjectData.creating">
    <div>Nouveau projet :</div>
    <input type="text" v-model="newProjectData.name" placeholder="Nom de du projet">
    <input type="text" v-model="newProjectData.description" placeholder="Description du projet">
    <button @click="createProject">Créer le projet</button>
  </pop-up>
  <pop-up @close="createTimeEntryData.creating = false" id="popupNewEntry" v-if="createTimeEntryData.creating">
    <div>Nouvelle entrée :</div>
    <div class="select-project">
      <select v-model="createTimeEntryData.project_id" name="activity">
        <option value="" selected disabled>Projet concerné</option>
        <option v-for="project in enabledProjects" :key="project.id" :value="project.id">{{ project.name }}</option>
      </select>
    </div>
    <div class="select-activity">
      <select v-model="createTimeEntryData.activity_id" name="project">
        <option value="" selected disabled>Type d'activité</option>
        <option v-for="activity in enabledActivities" :key="activity.id" :value="activity.id">{{
            activity.name
          }}
        </option>
      </select>
    </div>
    <div class="select-comment">
      <input v-model="createTimeEntryData.comment" type="text" name="commentaire" placeholder="Commentaire">
    </div>
    <div class="select-times">
      <input v-model="createTimeEntryData.start" type="datetime-local" name="start">
      <input v-model="createTimeEntryData.end" type="datetime-local" name="end">
    </div>
    <button @click="createTimeEntry">Ajouter</button>
  </pop-up>
  <pop-up @close="newObjectiveData.creating = false" id="popupNewObjective" v-if="newObjectiveData.creating">
    <div>Nouvel objectif :</div>
    <input type="text" v-model="newObjectiveData.name" placeholder="Intitulé de l'objectif">
    <input type="text" v-model="newObjectiveData.content" placeholder="Description de l'objectif">
    <button @click="createObjective">Créer l'objectif</button>
  </pop-up>


</template>

<style scoped lang="scss">
.current-activity {
  border: 1px solid red;
}

.start-activity {
  border: 1px solid green;
}

.activities {
  border: 1px solid blue;

  .create-entry {
    border: 1px solid orange;
  }

}


</style>

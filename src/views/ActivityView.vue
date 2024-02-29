<script>
import TimeEntry from "@/components/TimeEntryComponent.vue";
import PopUp from "@/components/PopUpComponent.vue";
import SideBar from "@/components/SideBar.vue";

export default {
  components: {
    TimeEntry,
    PopUp,
    SideBar
  },
  data() {
    return {
      currentDate: new Date().toISOString().slice(0, 10),
      currentTimeEntry: null,
      timer: "",
      timeEntriesToday: [],
      displayTimeEntriesToday: [],

      //pour les filtres sur ls time-entries
      allProjects: [],
      allActivities: [],

      //pr afficher seulement les projets et actis enabled dans les selects pr lancer un timer
      enabledActivities: [],
      enabledProjects: [],

      allObjectives: [],
      //que les objectifs qu'on affiche (on filtre allObjectives pour déterminer displayObjectives)
      displayObjectives: [],
      showObjectivesDone: false,
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

      //filtres sur les timeEntries
      filters: {
        project_id: "",
        activity_id: "",
        comment: ""
      },
      errors: []
    }
  },
  created() {
    this.$api.get('projects').then((resp) => {
      this.allProjects = resp.data
      this.enabledProjects = resp.data.filter(project => project.is_enabled === 1);
    })
    this.$api.get('activities').then((resp) => {
      this.allActivities = resp.data
      this.enabledActivities = resp.data.filter(activity => activity.is_enabled === 1);
    })
    this.$api.get('daily-objectives').then((resp) => {
      this.allObjectives = resp.data
      this.displayObjectives = resp.data.filter(objective => objective.done === 0);
    })
    //on récup l'activité en cours (time entry en cours, qui n'a pas de fin)
    this.$api.get('time-entries?end=').then((resp) => {
      resp.data[0] ? this.currentTimeEntry = resp.data[0] : null
      //jsp si c bourrin ou pas de faire ça ???????????
      if (this.currentTimeEntry) {
        this.currentTimeEntry.project = this.allProjects.find(project => project.id === this.currentTimeEntry.project_id)
        this.currentTimeEntry.activity = this.allActivities.find(activity => activity.id === this.currentTimeEntry.activity_id)
      }
    })
    this.getTimeEntriesToday()

    window.setInterval(() => {
      this.calcTimeSince()
    }, 1000)
  },
  methods: {
    getTimeEntriesToday() {
      //TODO : plus judicieux de récup celles qui se sont finies ajrd
      //pcq là c'est celles qui ont commencé et fini ajrd
      //mais dc on ferait sans les filtres de l'api
      this.$api.get('time-entries?from=' + this.currentDate + '&to=' + this.currentDate).then((resp) => {
        this.timeEntriesToday = resp.data
        this.displayTimeEntriesToday = resp.data
      })
    },
    calcTimeSince() {
      if (this.currentTimeEntry !== null) {
        const date = new Date(this.currentTimeEntry.start);
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
        this.allObjectives.push(resp.data)
      }).catch((err) => {
        console.log(err.response.data.errors)
      })
    },
    showAllObjectives() {
      this.objectiveSearch = ""
      this.showObjectivesDone = true
      this.displayObjectives = this.allObjectives
    },
    hideObjectivesDone() {
      this.objectiveSearch = ""
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
          this.currentTimeEntry = resp.data
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
      this.$api.patch(`time-entries/${this.currentTimeEntry.id}/stop`).then((resp) => {
        this.getTimeEntriesToday()
        this.currentTimeEntry = null
      }).catch((err) => {
        console.log(err.response.data)
      })
    },
    deleteFilters() {
      this.filters.project_id = ""
      this.filters.activity_id = ""
      this.filters.comment = ""
    },
  },
  watch: {
    objectiveSearch() {
      this.showObjectivesDone ?
          this.displayObjectives = this.allObjectives.filter(objective => objective.name.includes(this.objectiveSearch))
          : this.displayObjectives = this.allObjectives.filter(objective => objective.name.includes(this.objectiveSearch) && objective.done === 0)
    },
    filters: {
      handler() {
        this.displayTimeEntriesToday = this.timeEntriesToday.filter(entry =>
            (this.filters.project_id === "" || entry.project_id === this.filters.project_id) &&
            (this.filters.activity_id === "" || entry.activity_id === this.filters.activity_id) &&
            (this.filters.comment === "" || entry.comment.includes(this.filters.comment))
        )
      },
      deep: true
    }
  },
}
</script>

<template>

  <div class="sidebars">
    <side-bar position="left">
      <template #button>Activités du jour</template>
      <template #content>
        <div class="activities">
          <button @click="createTimeEntryData.creating = !createTimeEntryData.creating">Créer une entrée</button>
          <div class="filters">
            Filtrer la liste :
            <select v-model="filters.project_id" name="filter-project">
              <option value="" selected disabled>Projet concerné</option>
              <option v-for="project in allProjects" :key="project.id" :value="project.id">{{ project.name }}</option>
            </select>
            <select v-model="filters.activity_id" name="filter-activity">
              <option value="" selected disabled>Activité concernée</option>
              <option v-for="activity in allActivities" :key="activity.id" :value="activity.id">{{
                  activity.name
                }}
              </option>
            </select>
            <input v-model="filters.comment" type="text" name="commentaire"
                   placeholder="Commentaire">
            <button @click="deleteFilters">Supp les filtres</button>
          </div>
          <div v-if="displayTimeEntriesToday.length > 0" class="activities-list">
            <time-entry @update-entries="getTimeEntriesToday" v-for="entry in displayTimeEntriesToday" :key="entry.id"
                        :entry="entry"/>
          </div>
          <div v-else>Pas de Time Entry à afficher.</div>
        </div>
      </template>
    </side-bar>

    <side-bar position="right">
      <template #button>Objectifs</template>
      <template #content>
        <div class="objectives">
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
      </template>
    </side-bar>
  </div>


  <div v-if="currentTimeEntry" class="current-activity">
    <div class="info"><strong>{{ currentTimeEntry.project.name }}</strong></div>
    <div class="info">{{ currentTimeEntry.activity.name }}</div>
    <div class="timer">{{ timer }}</div>
    <button @click="stopActivity">Stop<img src="/icons/stop.svg" alt="stop icon"></button>
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
.sidebars {
  display: flex;
  justify-content: space-between;
  gap: 2em;
  padding: 1em;
}

.current-activity {
  width: 50vw;
  margin: auto;
  text-align: center;
  .info {
    font-size: 1.1em;
    font-weight: 300;
    strong {
      font-weight: 600;
      color: #ECBA07
    }
  }
  .timer {
    font-size: 5em;
    font-weight: 200
  }

  button {
    border-radius: 100px;
    border: 1px solid black;
    padding: .75em 1.5em;
    text-decoration: none;
    background-color: rgba(24, 24, 24, 0.5);
    color: #ECBA07;
    font-size: 1em;
    font-weight: 200;
    display: flex;
    gap: .5em;
    align-items: center;
    margin: auto;
    &:hover {
      background-color: rgba(24, 24, 24, 0.75);;
    }
  }

}

</style>

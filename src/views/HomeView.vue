<script>
import TimeEntry from "@/components/TimeEntryComponent.vue";
import Objective from "@/components/ObjectiveComponent.vue";
import PopUp from "@/components/PopUpComponent.vue";
import SideBar from "@/components/SideBarComponent.vue";
import currentActivity from "@/mixins/currentActivity.js";
import {toast} from "vue3-toastify";
import ToastOptions from "../../toasts/toastOptions.js";
import {mapActions, mapState} from 'pinia'
import {useAllObjectivesStore} from "@/stores/allObjectives.js";

export default {
  components: {
    TimeEntry,
    PopUp,
    SideBar,
    Objective
  },
  mixins: [currentActivity],
  data() {
    return {
      timeEntriesToday: [],
      displayTimeEntriesToday: [],

      //pour les filtres sur ls time-entries
      allProjects: [],
      allActivities: [],

      //pr afficher seulement les projets et actis enabled dans les selects pr lancer un timer
      enabledActivities: [],
      enabledProjects: [],

      //que les objectifs qu'on affiche (on filtre objectives pour déterminer displayObjectives)
      objectives: [],
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
        content: ""
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
    }).catch((err) => {
      console.log(err)
    })
    this.$api.get('activities').then((resp) => {
      this.allActivities = resp.data
      this.enabledActivities = resp.data.filter(activity => activity.is_enabled === 1);
    }).catch((err) => {
      console.log(err)
    })
    this.objectives = this.allObjectives
    this.displayObjectives = this.allObjectives.filter(objective => objective.done === 0);
    this.getTimeEntriesToday()
    this.startTimer()
  },
  methods: {
    ...mapActions(useAllObjectivesStore, ['setObjectives', 'addObjective']),
    getTimeEntriesToday() {
      this.$api.get('time-entries').then((resp) => {
        this.timeEntriesToday = resp.data.filter(entry => entry.end && entry.end.split(' ')[0] === new Date().toISOString().slice(0, 10));
        this.displayTimeEntriesToday = this.timeEntriesToday
      }).catch((err) => {
        console.log(err)
      })
    },
    getObjectives() {
      this.$api.get(`daily-objectives?date=${new Date().toISOString().slice(0, 10)}`).then((resp) => {
        this.setObjectives(resp.data)
        if (this.showObjectivesDone) {
          this.displayObjectives = resp.data
        } else {
          this.displayObjectives = resp.data.filter(objective => objective.done === 0);
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    createActivity() {
      this.$api.post('activities', {
        name: this.newActivityData.name,
        color: this.newActivityData.color
      }).then((resp) => {
        this.enabledActivities.push(resp.data)
        this.allActivities.push(resp.data)
        this.newActivityData = {
          creating: false,
          name: "",
          color: ""
        }
        this.newTimeEntryData.activity_id = resp.data.id
        toast.success(`Activité créée !`, ToastOptions);
      }).catch((err) => {
        toast.error(`${err.response.data.errors} !`, ToastOptions);
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
        this.newProjectData = {
          creating: false,
          name: "",
          description: ""
        }
        toast.success(`Projet créé !`, ToastOptions);
      }).catch((err) => {
        toast.error(`${err.response.data.errors} !`, ToastOptions);
      })
    },
    createObjective() {
      this.$api.post('daily-objectives', {
        name: this.newObjectiveData.name,
        content: this.newObjectiveData.content
      }).then((resp) => {
        this.newObjectiveData = {
          creating: false,
          name: "",
          content: ""
        }
        this.objectives.unshift(resp.data)
        this.displayObjectives.unshift(resp.data)
        toast.success(`Objectif créé !`, ToastOptions);
      }).catch((err) => {
        toast.error(`${err.response.data.errors} !`, ToastOptions);
      })
    },
    showAllObjectives() {
      this.objectiveSearch = ""
      this.showObjectivesDone = true
      this.displayObjectives = this.objectives
    },
    hideObjectivesDone() {
      this.objectiveSearch = ""
      this.showObjectivesDone = false
      this.displayObjectives = this.objectives.filter(objective => objective.done === 0);
    },
    createTimeEntry() {
      if (this.createTimeEntryData.activity_id !== "" && this.createTimeEntryData.project_id !== "" && this.createTimeEntryData.end !== "" && this.createTimeEntryData.start !== "") {
        this.$api.post('time-entries', {
          project_id: this.createTimeEntryData.project_id,
          activity_id: this.createTimeEntryData.activity_id,
          comment: this.createTimeEntryData.comment,
          start: this.createTimeEntryData.start.replace("T", " "),
          end: this.createTimeEntryData.end.replace("T", " ")
        }).then((resp) => {
          new Date(resp.data.end) === new Date() ?
              this.timeEntriesToday.push(resp.data)
              : null
          this.createTimeEntryData = {
            creating: false,
            activity_id: "",
            project_id: "",
            comment: "",
            start: "",
            end: ""
          }
          this.getTimeEntriesToday()
          toast.success(`Entrée ajoutée !`, ToastOptions);
        }).catch((err) => {
          toast.error(`${err.response.data.errors} !`, ToastOptions);
        })
      } else {
        toast.error(`Définit un début et une fin !`, ToastOptions);
      }
    },
    startActivity() {
      if (this.newTimeEntryData.activity_id !== "" || this.newTimeEntryData.project_id !== "") {
        this.$api.post('time-entries', {
          project_id: this.newTimeEntryData.project_id,
          activity_id: this.newTimeEntryData.activity_id,
          comment: this.newTimeEntryData.comment
        }).then(() => {
          this.getCurrentActivity()
          this.startTimer()
          this.newTimeEntryData.activity_id = ""
          this.newTimeEntryData.project_id = ""
          this.newTimeEntryData.comment = ""
          toast.success(`Activité lancée !`, ToastOptions);
        }).catch((err) => {
          toast.error(`${err.response.data.errors[0]} !</br>${err.response.data.errors[1]} !`, ToastOptions);
        })
      }
    },
    deleteFilters() {
      this.filters.project_id = ""
      this.filters.activity_id = ""
      this.filters.comment = ""
    },
  },
  computed: {
    ...mapState(useAllObjectivesStore, ['allObjectives']),
    currentActivityProject() {
      let project = this.allProjects.find(project => project.id === this.currentTimeEntry.project_id)
      return project ? project.name : ""
    },
    currentActivityActivity() {
      let activity = this.allActivities.find(activity => activity.id === this.currentTimeEntry.activity_id)
      return activity ? activity.name : ""
    },
  },
  watch: {
    objectiveSearch() {
      this.showObjectivesDone ?
          this.displayObjectives = this.objectives.filter(objective => objective.name.includes(this.objectiveSearch))
          : this.displayObjectives = this.objectives.filter(objective => objective.name.includes(this.objectiveSearch) && objective.done === 0)
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
    },
    currentTimeEntry() {
      //quand acti arrêtée (cf méthode ds le mixin), on refresh les timeEntries
      !this.currentTimeEntry ? this.getTimeEntriesToday() : null
    },
    allObjectives() {
      this.objectives = this.allObjectives
      if (this.showObjectivesDone) {
        this.displayObjectives = this.objectives
      } else {
        this.displayObjectives = this.allObjectives.filter(objective => objective.done === 0);
      }
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
          <button class="create" @click="createTimeEntryData.creating = !createTimeEntryData.creating">Créer une
            entrée
          </button>
          <button v-if="filters.project_id || filters.activity_id || filters.comment" class="filter"
                  @click="deleteFilters">Masquer les filtres
          </button>
          <div class="filters">
            <div class="filters-select">
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
            </div>
            <input v-model="filters.comment" type="text" name="commentaire"
                   placeholder="Commentaire">
          </div>
          <div v-if="displayTimeEntriesToday.length > 0" class="activities-list">
            <div class="title">Liste des activités :</div>
            <transition-group name="fade">
              <time-entry @update-entries="getTimeEntriesToday" v-for="entry in displayTimeEntriesToday" :key="entry.id"
                          :entry="entry"/>
            </transition-group>
          </div>
          <div v-else>Pas de Time Entry à afficher.</div>
        </div>
      </template>
    </side-bar>

    <side-bar position="right">
      <template #button>Objectifs du jour</template>
      <template #content>
        <div class="objectives">
          <button class="create" @click="newObjectiveData.creating = true">Créer un objectif</button>
          <button class="filter" v-if="!showObjectivesDone" @click="showAllObjectives">Voir aussi les objectifs
            atteints
          </button>
          <button class="filter" v-else @click="hideObjectivesDone">Cacher les objectifs atteints</button>
          <div class="filters">
            <input type="text" v-model="objectiveSearch" placeholder="Rechercher un objectif">
          </div>
          <div v-if="displayObjectives.length > 0" class="objectives-list">
            <div class="title">Liste des objectifs :</div>
            <transition-group name="fade">
              <objective @update-objectives="getObjectives" :objective="objective"
                         v-for="objective in displayObjectives"
                         class="objective" :key="objective.id"/>
            </transition-group>

          </div>
          <div v-else>
            <p v-if="objectives.length > 0">Tous les objectifs d'aujourd'hui ont été atteints !</p>
            <p v-else>Aucun objectif défini pour aujourd'hui... </p>
          </div>
        </div>
      </template>
    </side-bar>
  </div>


  <div v-if="currentTimeEntry" class="current-activity">
    <div class="info"><strong>{{ currentActivityProject }}</strong></div>
    <div class="info">{{ currentActivityActivity }}</div>
    <div class="timer">{{ timer }}</div>
    <button class="startStop" @click="stopActivity">Stop<img src="/icons/stop.svg" alt="stop icon"></button>
  </div>

  <div v-else class="start-activity">
    <h1>Lancer une activité :</h1>
    <div class="select-project">
      <select v-model="newTimeEntryData.project_id" name="activity">
        <option value="" selected disabled>Projet concerné</option>
        <option v-for="project in enabledProjects" :key="project.id" :value="project.id">{{ project.name }}</option>
      </select>
      <img src="/icons/plusGrey.svg" alt="plus icon" v-if="!newProjectData.creating"
           @click="newProjectData.creating = true">
    </div>
    <div class="select-activity">
      <select v-model="newTimeEntryData.activity_id" name="project">
        <option value="" selected disabled>Type d'activité</option>
        <option v-for="activity in enabledActivities" :key="activity.id" :value="activity.id">{{ activity.name }}
        </option>
      </select>
      <img src="/icons/plusGrey.svg" alt="plus icon" v-if="!newActivityData.creating"
           @click="newActivityData.creating = true">
    </div>
    <div class="select-comment">
      <input v-model="newTimeEntryData.comment" type="text" name="commentaire" placeholder="Commentaire">
    </div>
    <button class="startStop" @click="startActivity">Start<img src="/icons/start.svg" alt="stop icon"></button>
  </div>

  <pop-up @close="newActivityData.creating = false" id="popupNewActivity" v-if="newActivityData.creating">
    <template #title>Nouvelle activité :</template>
    <template #content>
      <div class="new-activity">
        <div class="label">
          <label for="name">Nom de l'activité :</label>
          <input name="name" type="text" v-model="newActivityData.name" placeholder="Nom de l'activité">
        </div>
        <div class="label color">
          <label for="color">Couleur associée :</label>
          <input name="color" type="color" v-model="newActivityData.color">
        </div>
      </div>
    </template>
    <template #button><span @click="createActivity">Créer l'activité</span></template>
  </pop-up>
  <pop-up @close="newProjectData.creating = false" id="popupNewProject" v-if="newProjectData.creating">
    <template #title>Nouveau projet :</template>
    <template #content>
      <div class="new-project">
        <div class="label">
          <label for="name">Nom du projet :</label>
          <input name="name" type="text" v-model="newProjectData.name" placeholder="Nom du projet">
        </div>
        <div class="label">
          <label for="desc">Description du projet :</label>
          <input name="desc" type="text" v-model="newProjectData.description" placeholder="Description du projet">
        </div>
      </div>
    </template>
    <template #button><span @click="createProject">Créer le projet</span></template>
  </pop-up>
  <pop-up @close="createTimeEntryData.creating = false" id="popupNewEntry" v-if="createTimeEntryData.creating">
    <template #title>Nouvelle entrée :</template>
    <template #content>
      <div class="new-time-entry">
        <div class="selects">
          <select v-model="createTimeEntryData.project_id" name="activity">
            <option value="" selected disabled>Projet concerné</option>
            <option v-for="project in enabledProjects" :key="project.id" :value="project.id">{{ project.name }}</option>
          </select>
          <select v-model="createTimeEntryData.activity_id" name="project">
            <option value="" selected disabled>Type d'activité</option>
            <option v-for="activity in enabledActivities" :key="activity.id" :value="activity.id">{{
                activity.name
              }}
            </option>
          </select>
        </div>
        <div class="label">
          <label for="comment">Commentaire :</label>
          <input name="comment" v-model="createTimeEntryData.comment" type="text" placeholder="Commentaire">
        </div>
        <div class="times">
          <div class="label">
            <label for="start">Début :</label>
            <input name="start" v-model="createTimeEntryData.start" type="datetime-local">
          </div>
          <div class="label">
            <label for="end">Fin :</label>
            <input v-model="createTimeEntryData.end" type="datetime-local" name="end">
          </div>
        </div>
      </div>
    </template>
    <template #button><span @click="createTimeEntry">Créer l'entrée</span></template>
  </pop-up>
  <pop-up @close="newObjectiveData.creating = false" id="popupNewObjective" v-if="newObjectiveData.creating">
    <template #title>Nouvel objectif :</template>
    <template #content>
      <div class="new-objective">
        <div class="label">
          <label for="name">Intitulé de l'objectif :</label>
          <input name="name" type="text" v-model="newObjectiveData.name" placeholder="Intitulé de l'objectif">
        </div>
        <div class="label">
          <label for="content">Description :</label>
          <input name="content" type="text" v-model="newObjectiveData.content" placeholder="Description de l'objectif">
        </div>
      </div>
    </template>
    <template #button><span @click="createObjective">Créer l'objectif</span></template>
  </pop-up>
</template>

<style scoped lang="scss">

.current-activity, .start-activity {
  width: 50vw;
  margin: auto;
  text-align: center;
}

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

h1 {
  font-size: 2.5em;
  margin-bottom: .5em;
}

.select-project, .select-activity, .select-comment {
  display: flex;
  justify-content: center;
  gap: .5em;
  align-items: center;
  margin: .5em
}

select, input {
  padding: .5em 1em;
  font-size: 1em;
  font-family: inherit;
  border-radius: 10px;
  border: 1px solid black;
  color: #8c8c8c;
  background: #1C1C1C;
  appearance: none;
  width: 70%;
}

select {
  background-image: url('/icons/arrow.svg');
  background-position: calc(100% - 0.75rem) center;
  background-repeat: no-repeat;
  text-overflow: ellipsis;
  padding-right: 2.5em;
}

.startStop {
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
  font-family: inherit;
  margin: 2em auto auto;

  &:hover {
    background-color: rgba(24, 24, 24, 0.75);;
  }
}

.sidebars {
  display: flex;
  justify-content: space-between;
  gap: 2em;
  padding: 1em;
}

.activities, .objectives {
  //Engueule moi Elian regarde comment tu vas détester comment g fait <3
  display: flex;
  flex-direction: column;
  gap: 1em;
  align-items: stretch;
  justify-content: center;

  .filters {
    width: 100%;
  }

  .filters-select {
    display: flex;
    gap: 1em;
    margin-bottom: 1em;
    flex-wrap: wrap;
  }

  select, input {
    border-color: #636765;
    color: #D4DFD8;
    background-color: #323333;
    font-size: .9em;
    flex-basis: 13em;
    flex-grow: 2;
    flex-shrink: 0;
    text-overflow: ellipsis;
  }

  input {
    box-sizing: border-box;
    width: 100%;
  }

  .create {
    border: 1px solid #636765;
    color: #D4DFD8;
    background-color: #323333;
    font-size: 1em;
    font-family: inherit;
    padding: .5em 1em;
    border-radius: 10px;
    margin: auto;

    &:hover {
      background-color: darken(#323333, 3%);
    }
  }

  .filter {
    border: none;
    background: none;
    appearance: none;
    font-family: inherit;
    color: #ECBA07;
    font-size: 1em;
    font-weight: 200;
    text-transform: uppercase;
    text-decoration: underline;
    text-underline-offset: 4px;
    text-align: left;

    &:hover {
      color: darken(#ECBA07, 7%)
    }
  }

  .title {
    text-transform: uppercase;
    text-decoration: underline;
    text-underline-offset: 4px;
    font-size: 1em;
    font-weight: 200;
    margin: .5em 0 1em;
  }
}

.new-activity, .new-objective, .new-project, .new-time-entry {
  display: flex;
  flex-direction: column;
  gap: .7em;

  .label {
    display: flex;
    flex-direction: column;
    gap: .5em;
  }

  input[type="text"] {
    width: inherit;
    font-size: .9em;
  }

  .color {
    display: flex;
    align-items: center;
    flex-direction: row;
  }

  input[type="color"] {
    appearance: none;
    background: none;
    border: 0;
    cursor: pointer;
    height: 1.4em;
    width: 1.4em;
    padding: 0;
    border-radius: 20%
  }

  ::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  ::-webkit-color-swatch {
    border: 0;
    border-radius: 0;
  }

  ::-moz-color-swatch,
  ::-moz-focus-inner {
    border: 0;
  }

  ::-moz-focus-inner {
    padding: 0;
  }

  label {
    font-weight: 400;
  }

  .selects {
    display: flex;
    gap: .5em;
  }

  input[type="datetime-local"] {
    width: inherit;
  }
}
</style>

<script>
import DatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import {DoughnutChart} from 'vue-chart-3'
import {Chart, registerables} from 'chart.js'
import TimeEntry from '@/components/TimeEntryComponent.vue'

Chart.register(...registerables)
export default {
  components: {
    TimeEntry,
    DatePicker,
    DoughnutChart
  },
  watch: {
    startDate() {
      this.updateView()
    },
    endDate() {
      this.updateView()
    },
    projectId() {
      this.updateView()
      this.display = 1;
    }
  },
  created() {
    this.getProjects()
    this.updateView()
  },
  data() {
    return {
      startDate: new Date(),
      endDate: new Date(),
      timeEntries: [],
      displayedTimeEntries: [],
      workingHours: 0,
      projectId: '',
      projects: [],

      display: 1,

      projectData: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: []
          }
        ]
      },
      activityData: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: []
          }
        ]
      }
    }
  },
  methods: {
    getTimesEntries() {
      return this.$api.get('time-entries?from=' + this.formatDateToApi(this.startDate) + '&to=' + this.formatDateToApi(this.endDate)).then((resp) => {
        return resp.data
      })
    },
    getProjects() {
      return this.$api.get('projects').then((resp) => {
        this.projects = resp.data
      })
    },
    getProjectById: function (id) {
      return this.$api.get('projects/' + id).then((resp) => {
        return {
          id: resp.data.id,
          name: resp.data.name
        }
      })
    },
    getActivityById(id) {
      return this.$api.get('activities/' + id).then((resp) => {
        if (resp.data.is_enabled) {
          return {
            name: resp.data.name,
            color: resp.data.color
          }
        } else {
          return 'Not active'
        }
      })
    },
    getData: function () {
      let workingHours = 0
      let projectHours = {}
      let activityHours = {}
      this.clearData()
      this.timeEntries.forEach(entry => {
        if (this.projectId !== '' && entry.project_id !== this.projectId) return
        this.displayedTimeEntries.push(entry)
        let start = new Date(entry.start)
        let end = new Date(entry.end)
        let hours = (end - start) / 1000 / 60 / 60
        workingHours += hours
        this.workingHours = this.formatWorkingHours(workingHours)

        hours = this.formatWorkingHoursToChart(hours)
        this.getActivityById(entry.activity_id).then((activity) => {
          let name = activity.name
          let color = activity.color
          if (activity === 'Not active') return
          if (activityHours[name]) {
            activityHours[name] += hours
          } else {
            activityHours[name] = hours
          }
          this.activityData.labels = Object.keys(activityHours)
          this.activityData.datasets[0].data = Object.values(activityHours)
          this.activityData.datasets[0].backgroundColor = this.activityData.labels.map((label) => {
            return this.activityData.datasets[0].backgroundColor[this.activityData.labels.indexOf(label)] || color
          })
        })

        if (this.projectId !== '') return
        this.getProjectById(entry.project_id).then((project) => {
          if (projectHours[project.name]) {
            projectHours[project.name] += hours
          } else {
            projectHours[project.name] = hours
          }
          this.projectData.labels = Object.keys(projectHours)
          this.projectData.datasets[0].data = Object.values(projectHours)
          this.projectData.datasets[0].backgroundColor = this.projectData.labels.map((label) => {
            return this.projectData.datasets[0].backgroundColor[this.projectData.labels.indexOf(label)] || this.generatePastelColor()
          })
        })
      })
    },

    clearProjectData() {
      this.projectData.labels = []
      this.projectData.datasets[0].data = []
      this.projectData.datasets[0].backgroundColor = []
    },
    clearActivityData() {
      this.activityData.labels = []
      this.activityData.datasets[0].data = []
      this.activityData.datasets[0].backgroundColor = []
    },
    clearData() {
      this.clearProjectData()
      this.clearActivityData()
      this.displayedTimeEntries = []
    },


    sortDates() {
      if (this.startDate > this.endDate) {
        let temp = this.startDate
        this.startDate = this.endDate
        this.endDate = temp
      }
    },
    sortTimesEntries() {
      return this.displayedTimeEntries.sort((a, b) => {
        return new Date(a.start) - new Date(b.start)
      })
    },

    intervalDates() {
      let dates = []
      let currentDate = new Date(this.startDate)
      while (currentDate <= this.endDate) {
        dates.push(new Date(currentDate))
        currentDate.setDate(currentDate.getDate() + 1)
      }
      dates.push(new Date(this.endDate))
      return dates
    },

    generatePastelColor() {
      const minValue = 100
      const maxValue = 230
      const r = Math.floor(Math.random() * (maxValue - minValue) + minValue)
      const g = Math.floor(Math.random() * (maxValue - minValue) + minValue)
      const b = Math.floor(Math.random() * (maxValue - minValue) + minValue)

      return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`
    },

    formatDateToDisplay(date) {
      let day = date.getDate()
      let month = date.getMonth() + 1
      month < 10 ? month = '0' + month : month
      day < 10 ? day = '0' + day : day
      return day + '/' + month + '/' + date.getFullYear()
    },
    formatDateToApi(date) {
      date = this.formatDateToDisplay(date)
      return date.split('/').reverse().join('-')
    },
    formatWorkingHours(workingHours) {
      let hours = Math.floor(workingHours)
      let minutes = Math.floor((workingHours - hours) * 60)
      let seconds = Math.floor(((workingHours - hours) * 60 - minutes) * 60)
      hours < 10 ? hours = '0' + hours : hours
      minutes < 10 ? minutes = '0' + minutes : minutes
      seconds < 10 ? seconds = '0' + seconds : seconds
      return hours + 'h ' + minutes + 'm ' + seconds + 's'
    },
    formatWorkingHoursToChart(workingHours) {
      return Math.round(workingHours * 10) / 10
    },

    checkDates(date) {
      this.sortDates()
      return this.formatDateToDisplay(date)
    },
    updateView() {
      this.getTimesEntries().then((timeEntries) => {
        this.timeEntries = timeEntries
        this.getData()
      })
    }
  }
}
</script>

<template>
  <main class="main">
    <div class="top">
      <h1>
        Statistiques du
        <DatePicker class="datepicker-size" v-model="startDate" :enable-time-picker="false"
                    :highlight="intervalDates()" :max-date="new Date()" prevent-min-max-navigation auto-apply>
          <template #trigger>
            <span class="clickable-text">{{ checkDates(startDate) }}</span>
          </template>
        </DatePicker>
        au
        <DatePicker class="datepicker-size" v-model="endDate" :enable-time-picker="false"
                    :highlight="intervalDates()" :max-date="new Date()" prevent-min-max-navigation auto-apply>
          <template #trigger>
            <span class="clickable-text">{{ checkDates(endDate) }}</span>
          </template>
        </DatePicker>
      </h1>
      <div class="filter">
        <div>Filtrer :</div>
        <select v-model="projectId">
          <option value="" selected disabled>Projet concerné</option>
          <option v-for="project in projects" :key="project.id" :value="project.id">
            {{ project.name }}
          </option>
        </select>
        <button v-if="projectId !== ''" @click="projectId = ''">Effacer</button>
      </div>
    </div>

    <h2 v-if="workingHours !== 0">Sur cette période, vous avez travaillé pendant <span class="time">{{ this.workingHours }}</span></h2>

    <div v-if="this.displayedTimeEntries.length > 0" class="data">
      <div class="infos charts">
        <div class="top" v-if="display === 1">
          <h3>Heures de travail / <strong>activité</strong></h3>
          <button v-if="projectId === ''" @click="display = 2" >Afficher par projet</button>
        </div>
        <div class="top" v-else-if="display === 2">
          <h3>Heures de travail / <strong>projet</strong></h3>
          <button @click="display = 1">Afficher par activité</button>
        </div>
        <div v-if="display === 1" class="chart">
          <DoughnutChart class="chart-size" :chart-data="this.activityData"/>
        </div>
        <div v-if="display === 2" class="chart">
          <DoughnutChart class="chart-size" :chart-data="this.projectData"/>
        </div>
      </div>

      <div class="infos time-entries">
        <div class="title">Liste des {{ this.displayedTimeEntries.length }} entrées : </div>
        <div class="entries">
          <TimeEntry :entry="timeEntry" v-for="timeEntry in sortTimesEntries()" :key="timeEntry.id"/>
        </div>
      </div>
    </div>
    <div class="no-data" v-else-if="projectId !== ''">
      Aucune entrée ne correspond à la période et au projet choisi...
    </div>
    <div class="no-data" v-else>Aucune entrée n'a été enregistrée sur cette période...</div>
  </main>
</template>

<style scoped lang="scss">

.clickable-text {
  width: fit-content;
  cursor: pointer;
  color: #7471F2;
}

.datepicker-size {
  width: fit-content;
}

#chart {
  display: flex;
  flex-direction: row;
  gap: 20px;
}

main {
  padding: 2em 2em 1em;
}

.no-data {
  text-align: center;
  font-size: 1.5em;
  font-weight: 300;
  margin-top: 1em;
}

.top {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .datepicker-size {
    font-family: inherit;
  }
}

h1 {
  margin: 0;
  text-transform: uppercase;
  font-weight: 400;
  font-size: 1.5em;
  display: flex;
  gap: .5em;
}

.filter {
  display: flex;
  gap: .25em;
  align-items: center;
  div {
    text-transform: uppercase;
    color: #ECBA07;
    font-weight: 200;
    font-size: 1.2em;
    padding-right: .5em;
  }

}

button {
  background-color: unset;
  color: #ECBA07;
  border: none;
  text-decoration: underline;
  text-underline-offset: 4px;
  font-weight: 100;
}

select {
  font-family: inherit;
  font-size: .9em;
  border-radius: 10px;
  border: 1px solid #636765;
  color: rgba(255, 255, 255, 0.57);
  background-color: #1C1C1C;
  appearance: none;
  background-image: url('/icons/arrow.svg');
  background-position: calc(100% - 0.75rem) center;
  background-repeat: no-repeat;
  text-overflow: ellipsis;
  padding: .5em 2.5em .5em 1em;
}

h2 {
  font-size: 1.5em;
  font-weight: 250;
  margin: 1em 0;
  text-align: center;
  .time {
    font-weight: 500;
  }
}

.data {
  display: flex;
  flex-direction: row;
}

.infos {
  flex-basis : 50vw;
}

.charts {
  padding-right: 1em;
  border-right: 2px solid #D4DFD8;

  h3 {
    font-weight: 400;
  }

  button {
    font-size: 1em;
  }
}
.time-entries {
  padding-left: 1em;
  .title {
    text-transform: uppercase;
    text-decoration: underline;
    text-underline-offset: 4px;
    font-size: 1em;
    font-weight: 200;
    margin-bottom: 1em;
  }
  .entries {
    overflow-y: scroll;
    height: 57vh;
  }
}


</style>
<script>
import ReportingHeader from '@/components/ReportingHeaderComponent.vue'
import DatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { DoughnutChart } from 'vue-chart-3'
import { Chart, registerables } from 'chart.js'
import TimeEntry from '@/components/TimeEntry.vue'

Chart.register(...registerables)
export default {
  components: {
    TimeEntry,
    DatePicker,
    DoughnutChart,
    ReportingHeader
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
    getProjectById: function(id) {
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
    getData: function() {
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
    <h1>Statistiques</h1>
    <ReportingHeader>
      <template #startDate>
        <DatePicker class="datepicker-size" v-model="startDate" :enable-time-picker="false"
                    :highlight="intervalDates()" :max-date="new Date()" prevent-min-max-navigation auto-apply>
          <template #trigger>
            <span class="clickable-text">{{ checkDates(startDate) }}</span>
          </template>
        </DatePicker>
      </template>
      <template #endDate>
        <DatePicker class="datepicker-size" v-model="endDate" :enable-time-picker="false"
                    :highlight="intervalDates()" :max-date="new Date()" prevent-min-max-navigation auto-apply>
          <template #trigger>
            <span class="clickable-text">{{ checkDates(endDate) }}</span>
          </template>
        </DatePicker>
      </template>
    </ReportingHeader>
    <select v-model="projectId">
      <option v-for="project in projects" :key="project.id" :value="project.id">
        {{ project.name }}
      </option>
    </select>
    <button @click="projectId = ''">Clear</button>


    <h3>Sur cette période vous avez travaillé pendant</h3>
    <h2>{{ this.workingHours }}</h2>

    <h3>Heures de travail / projet</h3>
    <h3>Heures de travail / activité</h3>
    <div id="chart">
      <DoughnutChart class="chart-size" :chart-data="this.projectData" />
      <DoughnutChart class="chart-size" :chart-data="this.activityData" />
    </div>
    <div>
      <h2>Times Entries</h2>
      {{ this.displayedTimeEntries.length }} entries
      <TimeEntry :entry="timeEntry" v-for="timeEntry in sortTimesEntries()" :key="timeEntry.id" />

    </div>
  </main>
</template>

<style scoped>
.clickable-text {
  width: fit-content;
  cursor: pointer;
  color: blue;
}

.datepicker-size {
  width: fit-content;
}

#chart {
  display: flex;
  flex-direction: row;
  gap: 20px;
}

.chart-size {
  width: 50%;
}
</style>
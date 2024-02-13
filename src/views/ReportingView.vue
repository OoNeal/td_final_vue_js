<script>
import ReportingHeader from '@/components/ReportingHeaderComponent.vue'
import DatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

export default {
  components: {
    DatePicker,
    ReportingHeader
  },
  data() {
    return {
      startDate: new Date(),
      endDate: new Date(),
      timeEntries: []
    }
  },
  methods: {
    getTimesEntries() {
      this.$api.get('time-entries?from=' + this.formatDateToApi(this.startDate) + '&to=' + this.formatDateToApi(this.endDate)).then((resp) => {
        this.timeEntries = resp.data
      })
    },
    getWorkingHours() {
      let workingHours = 0
      this.timeEntries.forEach(entry => {
        let start = new Date(entry.start)
        let end = new Date(entry.end)
        workingHours += (end - start) / 1000 / 60 / 60
      })
      return workingHours
    },
    getTimesEntriesByProject() {
      let projects = []
      this.timeEntries.forEach(entry => {
        if (!projects.includes(entry.project)) {
          projects.push(entry.project)
        }
      })
      return projects
    },
    getTimesEntriesByActivity() {
      let activities = []
      this.timeEntries.forEach(entry => {
        if (!activities.includes(entry.activity)) {
          activities.push(entry.activity)
        }
      })
      return activities
    },

    orderDates() {
      if (this.startDate > this.endDate) {
        let temp = this.startDate
        this.startDate = this.endDate
        this.endDate = temp
      }
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
    updateView(date) {
      this.getTimesEntries()
      this.orderDates()
      return this.formatDateToDisplay(date)
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
    formatWorkingHours() {
      let workingHours = this.getWorkingHours()
      let hours = Math.floor(workingHours)
      let minutes = Math.floor((workingHours - hours) * 60)
      let seconds = Math.floor(((workingHours - hours) * 60 - minutes) * 60)
      hours < 10 ? hours = '0' + hours : hours
      minutes < 10 ? minutes = '0' + minutes : minutes
      seconds < 10 ? seconds = '0' + seconds : seconds
      return hours + 'h ' + minutes + 'm ' + seconds + 's'
    }
  },
  created() {
    this.getTimesEntries()
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
            <span class="clickable-text">{{ updateView(startDate) }}</span>
          </template>
        </DatePicker>
      </template>
      <template #endDate>
        <DatePicker class="datepicker-size" v-model="endDate" :enable-time-picker="false"
                    :highlight="intervalDates()" :max-date="new Date()" prevent-min-max-navigation auto-apply>
          <template #trigger>
            <span class="clickable-text">{{ updateView(endDate) }}</span>
          </template>
        </DatePicker>
      </template>
    </ReportingHeader>

    <h3>Sur cette période vous avez travaillé pendant</h3>
    <h2>{{ formatWorkingHours() }}</h2>


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
</style>
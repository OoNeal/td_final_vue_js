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
    orderDates() {
      if (this.startDate > this.endDate) {
        let temp = this.startDate
        this.startDate = this.endDate
        this.endDate = temp
      }
    },
    formatDateToDisplay(date) {
      let month = date.getMonth() + 1
      month < 10 ? month = '0' + month : month
      return date.getDate() + '/' + month + '/' + date.getFullYear()
    },
    formatDateToApi(date) {
      date = this.formatDateToDisplay(date)
      return date.split('/').reverse().join('-')
    },
    displayedDate(date) {
      this.orderDates()
      return this.formatDateToDisplay(date)
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
            <span class="clickable-text">{{ displayedDate(startDate) }}</span>
          </template>
        </DatePicker>
      </template>
      <template #endDate>
        <DatePicker class="datepicker-size" v-model="endDate" :enable-time-picker="false"
                    :highlight="intervalDates()" :max-date="new Date()" prevent-min-max-navigation auto-apply>
          <template #trigger>
            <span class="clickable-text">{{ displayedDate(endDate) }}</span>
          </template>
        </DatePicker>
      </template>
    </ReportingHeader>

    <h3>Sur cette période vous avez travaillé pendant</h3>
    <h2>{{ getWorkingHours() }}</h2>
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
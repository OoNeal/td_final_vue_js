<template>
  <nav>
    <div class="upperNav">
      <button @click="toggleTimer">Commencer son temps de travail: {{ formatTime(duration) }}</button>
      <p>nombres d'objectifs atteints: </p>
      <routerLink to="/activity">Voir les activités</routerLink>
      <routerLink to="/project">Voir les statistiques</routerLink>

    </div>

    <div class="bottomNav">

      <p>Activités en cours: </p>
      <button type="button" aria-label="stop"><img src="../../public/img/Stop_button.png">Stopper l'activité en cours
      </button>
      <routerLink to="/setting">Paramètres globaux</routerLink>
      <routerLink to="/setting">Voir les statistiques</routerLink>

    </div>
  </nav>
</template>

<script>


export default {
  data() {
    return {
      timerRunning: false,
      startTime: null,
      duration: 0,
      timerInterval: null

    }
  },
  methods: {
    toggleTimer() {
      if (this.timerRunning) {
        this.stopTimer()
      } else {
        this.startTimer()
      }
    },
    startTimer() {
      this.timerRunning = true
      this.startTime = Date.now()
      this.timerInterval = setInterval(function() {
        this.duration = Date.now() - this.startTime
      }.bind(this), 1000)
    },
    stopTimer() {
      this.timerRunning = false
      clearInterval(this.timerInterval)
    },
    formatTime(milliseconds) {
      const seconds = Math.floor(milliseconds / 1000)
      const minutes = Math.floor(seconds / 60)
      const hours = Math.floor(minutes / 60)

      const formattedTime =
        String(hours).padStart(2, '0') +
        ':' +
        String(minutes % 60).padStart(2, '0') +
        ':' +
        String(seconds % 60).padStart(2, '0')

      return formattedTime
    }

  }
}

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

p {
  color: #FFFFFF;
}

nav {
  display: flex;
  flex-direction: column;

}


.upperNav {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #02020A;
  height: 50px;
}

.upperNav p {
  margin: 0;
  font-family: 'Poppins', sans-serif;
  font-weight: 300;
  font-size: 20px;
}


.upperNav a {
  font-family: 'Poppins', sans-serif;
  font-weight: 300;
  font-size: 20px;
  text-decoration: none;
  color: #FFFFFF;
  margin-left: 15px;
}

.upperNav button {
  font-family: 'Poppins', sans-serif;
  background-color: #ffffff;
  border: none;
  padding: 10px;
  cursor: pointer;
  border-radius: 20px;
  text-transform: uppercase;
}


.bottomNav {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #E1E2EF;
  height: 100px;
}

.bottomNav p {
  margin: 0;
  font-family: 'Poppins', sans-serif;
  font-weight: 300;
  font-size: 20px;
  color: #333;
}


.bottomNav button {
  font-family: 'Poppins', sans-serif;
  background-color: #333;
  color: #fff;
  border: none;
  padding: 10px;
  cursor: pointer;
  border-radius: 20px;
  text-align: center;
  vertical-align: middle;
}


.bottomNav a {
  text-decoration: none;
  color: #333;
  margin-left: 15px;
  font-family: 'Poppins', sans-serif;
  font-weight: 300;
  font-size: 20px;
}

img {
  width: 25px;
  height: 25px;
  text-align: center;
  vertical-align: middle;
  padding: 2px;
}

</style>
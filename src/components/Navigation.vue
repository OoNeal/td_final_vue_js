<template>
 <nav>
    <div class="upperNav">

        <button @click="toggleTimer">nombres d'heures travaillées aujourd'hui:{{ timerRunning ? 'Arrêter' : 'Démarrer' }}</button>>
        <p>nombres d'objectifs atteints: </p>
        <routerLink to="../views/Activity.vue">Voir les activités</routerLink>
        <routerLink to="../views/Project.vue">Voir les statistiques</routerLink>

    </div>

    <div class="bottomNav">

        <p>Activités en cours: </p>
        <button type="button" aria-label="stop"><img src="../assets/img/Stop_button.png">Stopper l'activité en cours</button>
        <routerLink to="../views/Settings.vue">Paramètres globaux</routerLink>
        <routerLink to="../views/Settings.vue">Voir les statistiques</routerLink>

    </div>
 </nav>
</template>

<script>

export default{
    data() {
    return {
        timerRunning: false,
        startTime: null,
        duration: 0,
        timerInterval: null,
    };
    },
    methods: {
    startTimer() {
      this.timerRunning = true;
      this.startTime = Date.now();
      this.timerInterval = setInterval(() => {
        this.duration = Date.now() - this.startTime;
      }, 1000);
    },
    stopTimer() {
      this.timerRunning = false;
      clearInterval(this.timerInterval);
    },
    resetTimer() {
      this.timerRunning = false;
      this.startTime = null;
      this.duration = 0;
      clearInterval(this.timerInterval);
    },
    formatTime(milliseconds) {
      const seconds = Math.floor(milliseconds / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);

      const formattedTime =
        String(hours).padStart(2, '0') +
        ':' +
        String(minutes % 60).padStart(2, '0') +
        ':' +
        String(seconds % 60).padStart(2, '0');

      return formattedTime;
    }
}
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

p{
    color: #FFFFFF ;
}

nav {
    display: flex;
    flex-direction: column;
   
}


.upperNav {
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color:#02020A;
    height:50px;
}

.upperNav p {
    margin: 0; 
    font-family:'Poppins',sans-serif;
    font-weight:300;
    font-size:20px;
}


.upperNav a {
    font-family:'Poppins',sans-serif;
    font-weight:300;
    font-size:20px;
    text-decoration: none;
    color: #FFFFFF; 
    margin-left: 15px; 
}


.bottomNav {
    display: flex;
    justify-content:space-around;
    align-items: center;
    background-color:#E1E2EF;
    height:100px;
}

.bottomNav p {
    margin: 0;
    font-family:'Poppins',sans-serif;
    font-weight:300;
    font-size:20px;
    color: #333 ;
}


.bottomNav button {
    background-color: #dc3545; 
    border: none;
    padding: 5px;
    cursor: pointer;
}


.bottomNav a {
    text-decoration: none;
    color: #333 ;   
     margin-left: 15px; 
    font-family:'Poppins',sans-serif;
    font-weight:300;
    font-size:20px;
}

img{
    width: 25px;
    height:25px;
}

</style>
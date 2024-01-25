<template>
 <nav>
    <div class="upperNav">
        <p>nombres d'heures travaillées aujourd'hui: {{ totalCount }}</p>
        <p>nombres d'objectifs atteints: {{ totalObjectives }}</p>
        <routerLink to="../views/Activity.vue">Voir les activités</routerLink>
        <routerLink to="../views/Project.vue">Voir les statistiques</routerLink>
    </div>
    <div class="bottomNav">
        <p>Activités en cours: {{ PendingActivity }}</p>
        <button type="button" aria-label="stop"><img src="../assets/img/Stop_button.png"></button>
        <routerLink to="../views/Settings.vue">Voir les activités</routerLink>
        <routerLink to="../views/Project.vue">Voir les statistiques</routerLink>
    </div>
 </nav>
</template>

<script>

</script>

<style>

</style>
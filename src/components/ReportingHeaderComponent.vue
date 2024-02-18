<script>
export default {

}
</script>

<template>
  <header class="flex-row">
    Statistiques du <slot name="startDate"></slot> au <slot name="endDate"></slot>
  </header>
</template>

<style scoped>
.flex-row {
  display: flex;
  flex-direction: row;
  align-items: baseline;
  gap: 20px;
}
</style>
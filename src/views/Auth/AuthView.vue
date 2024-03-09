<script setup>

</script>

<template>
  <main>
    <img src="/public/img/hourglass.jpg" alt="B&W hourglass">
    <RouterView />
  </main>
</template>

<style scoped lang='scss'>
  main {
    width: 100vw;
    height: calc(100vh - 68px);

    display: flex;
    flex-direction: row;
    align-items: center;

    & > img {
      width: 40%;
      height: 100%;
      object-fit: cover;
    }
  }
</style>
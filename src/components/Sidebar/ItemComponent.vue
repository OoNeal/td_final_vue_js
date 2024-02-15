<script>

</script>

<template>
  <main>
    <slot >

    </slot>
  </main>
  <RouterView />
</template>

<style scoped lang="scss">

main {
  height: 7vw;
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;

  &:hover {
    background-color: #f0f0f0;
    cursor: pointer;
  }
}

</style>
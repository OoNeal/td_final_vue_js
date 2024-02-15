<script>
export default {
  props: {
    direction: {
      type: String,
      default: 'left'
    }
  }
}
</script>

<template>
  <main :class="direction" class="sidebar">
    <img class="sidebar_icon" src="../../assets/icons/add.svg" alt="cross" />
    <div class="sidebar_content">
      <slot></slot>
    </div>
  </main>
</template>

<style scoped lang="scss">
.sidebar {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 250px;

  background-color: tan;

  &.right {
    align-items: flex-end;
  }

  &.left {
    align-items: flex-start;
  }

  &_icon {
    width: 35px;
    height: 35px;
    margin: 10px;

    &:hover {
      cursor: pointer;
    }
  }

  &_content {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    width: 100%;
  }
}
</style>
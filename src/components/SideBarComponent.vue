<script>
export default {
  props: {
    canClose: {
      type: Boolean,
      required: false,
      default: true
    },
    position: {
      type: String,
      required: true,
      default: "right"
    }
  },
  data() {
    return {
      visible: false
    }
  },
  methods: {
    toggle() {
      this.visible = !this.visible
    }
  },
  directives: {
    position(el, binding) {
      //binding.value === "left" ? el.style.left = "0" : el.style.right = "0"
      el.classList.add(binding.value)
    }
  }
}
</script>

<template>
  <div v-if="canClose" @click="toggle" class="mini-nav" :class="{visible : !visible}">
    <div class="button">
      <slot name="button"></slot>
    </div>
    <img src="/icons/plusOrange.svg" alt="plus icon">
  </div>
  <section v-position="position" class="sidenav" :class="{visible: visible}">
    <div class="top">
      <img v-if="canClose" src="/icons/crossOrange.svg" alt="cross icon" @click="toggle">
      <div class="button">
        <slot class="button" name="button"></slot>
      </div>
    </div>
    <div class="sidenav-content">
      <slot name="content"></slot>
    </div>
  </section>
</template>

<style scoped lang="scss">

.mini-nav {
  background-color: black;
  width: fit-content;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: .5em;
  padding: .5em;
  border-radius: 5px;
  cursor: pointer;

  img {
    height: 1em;
  }
}

.sidenav {
  width: 40vw;
  max-width: 30em;
  min-width: 20em;
  position: absolute;
  z-index: 1000;
  top: 0;
  background-color: #181818;
  height: 100%;
  transition: all 0.5s ease;
  overflow-y: scroll;
  overflow-x: hidden;
  //padding-top: 13vh;

  .top {
    background-color: #181818;
    z-index: 10;
    width: inherit;
    max-width: inherit;
    min-width: inherit;
    height: 13vh;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: fixed;
    gap: .5em;
    border-bottom: 1px solid black;

    .button {
      width: 100%;
      font-size: 1.5em;
      text-transform: uppercase;
      text-align: center;
      padding-bottom: .5em;
    }

    img {
      margin: 1em 1em 0;
      cursor: pointer;
    }
  }

}

.sidenav-content {
  box-sizing: border-box;
  padding: 1em;
  margin-top: 14vh;
}

.sidenav.left {
  left: -40vw;
  .top {
    align-items: flex-end;
  }
}

.sidenav.right {
  right: -40vw;
  .top {
    align-items: flex-start;
  }
}

.sidenav.right.visible {
  right: 0;
  transition: all 0.5s ease;
  border-left: 1px solid #D4DFD8;
}

.sidenav.left.visible {
  left: 0;
  transition: all 0.5s ease;
  border-right: 1px solid #D4DFD8;
}


</style>
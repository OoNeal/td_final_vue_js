<script>
export default {
  props: {
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
  <div @click="toggle" class="mini-nav" :class="{visible : !visible}">
    <div>
      <slot name="button"></slot>
    </div>
    <img src="/icons/plusOrange.svg" alt="plus icon" >
  </div>
  <section v-position="position" class="sidenav" :class="{visible: visible}">
    <div class="sidenav-content">
      <slot name="button"></slot>
      <img src="/icons/cross.svg" alt="cross icon" @click="toggle">
      <slot name="content"></slot>
    </div>
  </section>
</template>

<style scoped lang="scss">

.mini-nav {
  background-color: black;
  color: white;
  width: fit-content;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: .5em;
  padding: .5em;
  border-radius: 5px;
}

.sidenav {
  width: 35vw;
  max-width: 25em;
  position: absolute;
  z-index: 1000;
  top: 0;
  background-color: black;
  height: 100%;
  transition : all 0.5s ease;
}

.sidenav.left {
  left: -40vw;
}

.sidenav.right {
  right: -40vw;
}

.sidenav.right.visible {
  right: 0;
  transition : all 0.5s ease;
}

.sidenav.left.visible {
  left: 0;
  transition : all 0.5s ease;
}


</style>
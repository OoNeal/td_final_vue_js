<script>
export default {
  props: {
    inHeader: {
      type: Boolean,
      required: false,
      default: false
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
  <div class="link" v-if="inHeader" @click="toggle" :class="{link_active : visible}">
    <slot name="link"></slot>
  </div>
  <div v-else @click="toggle" v-position="position" class="mini-nav" :class="{visible : !visible}">
    <div class="button">
      <slot name="button"></slot>
    </div>
    <img v-position="position" src="/icons/light-arrow.svg" alt="arrow">
  </div>
  <section v-position="position" class="sidenav" :class="{visible: visible}">
    <div class="top">
      <img src="/icons/crossOrange.svg" alt="cross icon" @click="toggle">
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

.link {
  cursor: pointer;

  &_active {
    color: #ECBA07;
    font-weight: 500;
  }
}


.mini-nav {
  background-color: rgba(black, 0.15);
  backdrop-filter: blur(15px);
  width: fit-content;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: .5em;
  padding: .5em;
  border-radius: 5px;
  cursor: pointer;

  &.right {
    flex-direction: row-reverse;
  }
  img {
    height: 0.8em;

    &.right {
      transform: rotate(180deg);
    }
  }

}

.sidenav {
  width: 40vw;
  max-width: 30em;
  min-width: 20em;
  position: absolute;
  z-index: 1000;
  top: 0;
  background-color: rgba(24,24,24,0.7);
  backdrop-filter: blur(15px);
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
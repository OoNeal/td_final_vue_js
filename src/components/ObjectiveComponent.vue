<script>
export default {
  emits: ['update-objectives'],
  props: {
    change: {
      type: Boolean,
      required: false,
      default: false
    },
    objective: {
      type: Object,
      required: true
    }
  },
  directives: {
    done: {
      mounted(el, binding) {
        binding.value === 1 || binding.value === true ?
            el.style.backgroundColor = '#ECBA07'
            : el.style.backgroundColor = '#212121';
      },
      updated(el, binding) {
        binding.value === 1 || binding.value === true ?
            el.style.backgroundColor = '#ECBA07'
            : el.style.backgroundColor = '#212121';
      }
    }
  },
  methods: {
    toggleDone() {
      if (this.objective.done === 0) {
        this.$api.patch(`/daily-objectives/${this.objective.id}/done`).then(() => {
          this.$emit('update-objectives')
        }).catch((err) => {
          console.log(err)
        })
      } else {
        this.$api.patch(`/daily-objectives/${this.objective.id}/undone`).then(() => {
          this.$emit('update-objectives')
        }).catch((err) => {
          console.log(err)
        })
      }
    }
  }
}


</script>

<template>
  <div class="objective">
    <div @click="toggleDone" v-done="objective.done" class="check"></div>
    <div class="infos">
      <div class="name">{{ objective.name }}</div>
      <div v-if="objective.content" class="content">{{ objective.content }}</div>
    </div>
  </div>

</template>

<style scoped lang="scss">
.objective {
  border: 0.05em solid #D4DFD8;
  border-radius: 10px;
  color: #D4DFD8;
  background-color: #323333;
  padding: .6em 1em;
  margin-top: 1em;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 1.3em;

  .check {
    width: 1.3em;
    height: 1.3em;
    border-radius: 5px;
    cursor: pointer;
    background-color: #212121;
  }

  .infos {
    display: flex;
    flex-direction: column;
    gap: .3em;
  }

  .name {
    font-weight: 550;
    text-transform: uppercase;
  }

  .content {
    font-weight: 300;
  }
}

</style>
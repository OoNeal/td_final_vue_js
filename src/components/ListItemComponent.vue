<script>
import PopUp from '@/components/PopUpComponent.vue'

export default {
  components: {
    PopUp
  },
  props: {
    isProject: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isEnabled: this.item.is_enabled === 1,
      isEditing: false,
      editItem: {}
    }
  },
  methods: {
    getItemData() {
      console.log(this.item)
      this.editItem = {
        name: this.item.name
      }
      if (this.isProject) {
        this.editItem.description = this.item.description
      } else {
        this.editItem.color = this.item.color
      }
    },

    toggleEnabled() {
      this.isEnabled = !this.isEnabled
      this.editEnabling()
    },
    toggleEditing() {
      this.isEditing = !this.isEditing
      if (this.isEditing) {
        this.getItemData()
      }
    },

    editEnabling() {
      this.$api.patch(`${this.isProject ? 'projects' : 'activities'}/${this.item.id}/${this.isEnabled ? 'enable' : 'disable'}`).then(() => {
        console.log(`${this.item.name} mis à jour`)
        this.$emit('update-view')
      }).catch((err) => {
        console.log(err)
      })
    },
    saveItem() {
      this.toggleEditing()
      this.$api.put(`${this.isProject ? 'projects' : 'activities'}/${this.item.id}`, this.editItem).then(() => {
        console.log(`${this.item.name} mis à jour`)
        this.$emit('update-view')
      }).catch((err) => {
        console.log(err)
      })
    }
  },
  directives: {
    is_enabled: {
      mounted(el, binding) {
        binding.value === 1 || binding.value === true ?
          el.style.backgroundColor = '#ECBA07'
          : el.style.backgroundColor = '#212121'
      },
      updated(el, binding) {
        binding.value === 1 || binding.value === true ?
          el.style.backgroundColor = '#ECBA07'
          : el.style.backgroundColor = '#212121'
      }
    }
  }
}
</script>

<template>
  <div class="item">
    <div class="item_checkbox" v-is_enabled="item.is_enabled" @click="toggleEnabled" />
    <div class="item_content">
      <h2>{{ item.name }}</h2>
      <p v-if="isProject">{{ item.description }}</p>
    </div>
    <div class="actions-icons">
      <img @click="toggleEditing" src="/icons/editOrange.svg" alt="edit icon">
    </div>
    <PopUp @close="toggleEditing" v-if="isEditing">
      <template #title v-if="isProject">Modifier le projet</template>
      <template #title v-else>Modifier l'activité</template>
      <template #content>
        <div class="edit-item">
          <div class="label">
            <label for="name" v-if="isProject">Nom du projet</label>
            <label for="name" v-else>Nom de l'activité</label>
            <input name="name" type="text" v-model="editItem.name" placeholder="Entrez le nom">
          </div>
          <div v-if="isProject" class="label">
            <label for="description">Description</label>
            <textarea name="description" v-model="editItem.description" />
          </div>
          <div v-else class="label color">
            <label for="color">Couleur associée :</label>
            <input name="color" type="color" v-model="editItem.color">
          </div>
        </div>
      </template>
      <template #button><span @click="saveItem">Enregistrer</span></template>
    </PopUp>
  </div>
</template>

<style scoped lang="scss">

.item {
  margin: 1em 0;
  width: 90%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #D4DFD8;

  &_checkbox {
    width: 1.3em;
    height: 1.3em;
    border-radius: 5px;
    cursor: pointer;
    background-color: #212121;
    border: #D4DFD8 1px solid;
  }

  &_content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}

.actions-icons {
  display: flex;
  gap: 1em;

  img {
    height: 1.3em;
    cursor: pointer;
  }
}

.edit-item {
  display: flex;
  flex-direction: column;
  gap: .7em;

  .label {
    display: flex;
    flex-direction: column;
    gap: .5em;
  }

  input, textarea {
    padding: .5em 1em;
    font-size: 1em;
    font-family: inherit;
    border-radius: 10px;
    border: 1px solid black;
    color: #D4DFD8;
    background: #1C1C1C;
    appearance: none;
    width: 70%;
  }

  textarea {
    width: 90%;
    resize: vertical;
    height: 5em;
  }

  input[type="text"] {
    width: inherit;
    font-size: .9em;
  }

  .color {
    display: flex;
    align-items: center;
    flex-direction: row;
  }

  input[type="color"] {
    appearance: none;
    background: none;
    border: 0;
    cursor: pointer;
    height: 1.4em;
    width: 1.4em;
    padding: 0;
    border-radius: 20%
  }

  ::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  ::-webkit-color-swatch {
    border: 0;
    border-radius: 0;
  }

  ::-moz-color-swatch,
  ::-moz-focus-inner {
    border: 0;
  }

  ::-moz-focus-inner {
    padding: 0;
  }

  label {
    font-weight: 400;
  }

  .selects {
    display: flex;
    gap: .5em;
  }

  input[type="datetime-local"] {
    width: inherit;
  }
}

</style>
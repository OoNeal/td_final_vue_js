<script>
import { useAuthStore } from '@/stores/Auth.js'
import { mapActions } from 'pinia'

export default {
  props: {
    to: {
      type: String,
      required: true
    },
    isLogout: {
      type: Boolean,
      required: false,
      default: false
    },
    isSelected: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  methods: {
    ...mapActions(useAuthStore, ['setApiKey']),
    logout() {
      this.setApiKey(null)
    }
  },
  created() {
    if (this.isLogout) {
      this.logout()
    }
  }
}

</script>

<template>
  <RouterLink :id="isSelected ? 'selected' : ''" class="item" :to="to">
    <slot>

    </slot>
  </RouterLink>
</template>

<style scoped lang="scss">

.item {
  height: 15vh;
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  border-top: 1px solid #D4DFD8;
  border-bottom: 1px solid #D4DFD8;

  text-transform: uppercase;
  font-size: 1em;
  color: #D4DFD8;
  text-decoration: none;

  &:hover {
    background-color: rgba(0, 0, 0, 0.25);
    cursor: pointer;
  }
}

#selected {
  color: #ECBA07;
  text-decoration: underline 1px #ECBA07;
  font-weight: 500;
}

</style>
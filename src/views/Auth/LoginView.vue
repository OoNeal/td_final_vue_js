<script>
import { useAuthStore } from '@/stores/Auth.js'
import { mapActions, mapState } from 'pinia'

export default {
  computed: {
    ...mapState(useAuthStore, ['apiKey']),
    ...mapState(useAuthStore, ['returnUrl'])
  },
  data() {
    return {
      userKey: '',
      errors: []
    }
  },
  methods: {
    ...mapActions(useAuthStore, ['setApiKey']),
    login() {
      this.errors = []
      if (this.apiKey !== this.userKey && this.apiKey === null) {
        this.$api.get('profile', {
          headers: {
            Authorization: `key=${this.userKey}`
          }
        }).then(() => {
          this.setApiKey(this.userKey)
          this.$router.push(this.returnUrl || '/')
        }).catch(() => {
          this.errors.push('Clé invalide')
        })
      } else {
        this.$router.push(this.returnUrl || '/')
      }
    }
  }
}
</script>

<template>
  <div>
    <h2>Login Page</h2>
    <input v-model="userKey">
    <button @click="login">Login</button>
    <RouterLink to="/auth/register">Register</RouterLink>
  </div>
</template>

<style scoped>

</style>
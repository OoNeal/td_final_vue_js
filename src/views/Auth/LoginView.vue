<script >
import { useAuthStore } from '@/stores/Auth.js'
import { mapState } from 'pinia'

export default {
  computed: {
    ...mapState(useAuthStore, ['apiKey']),
    ...mapState(useAuthStore, ['returnUrl']),
  },
  data() {
    return {
      userKey: "",
      errors: [],
    }
  },
  methods: {
    login() {
      this.errors = [];
      if (this.userKey !== this.apiKey) {
        this.errors.push("La clé API est incorrecte");
        return;
      }
      this.$router.push(this.returnUrl || "/");
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
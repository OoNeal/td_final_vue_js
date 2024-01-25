<script >
import { getApiKey } from '@/stores/Auth.js'

export default {
  data() {
    return {
      apiKey: "",
      errors: [],
    }
  },
  methods: {
    login() {
      this.errors = [];
      if (this.apiKey !== getApiKey()) {
        this.errors.push("La clé API est incorrecte");
        return;
      }
      this.$router.push({ name: "home" });
    }
  }
}
</script>

<template>
  <div>
    {{errors[errors.length - 1]}}
    <h2>Login Page</h2>
    <input v-model="apiKey">
    <button @click="login">Login</button>
    <RouterLink to="/register">Register</RouterLink>
  </div>
</template>

<style scoped>

</style>
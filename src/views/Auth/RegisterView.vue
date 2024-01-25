<script >
import { setApiKey } from '@/stores/Auth.js'
import api from '@/plugins/api.js'
import { normalizeClass } from 'vue'
export default {
  data() {
    return {
      name: "",
      firstname: "",
      email: "",
      errors: [],
    }
  },
  methods: {
    register() {
      this.errors = [];
      api.post("apikeys", {
        name: `${this.firstname} ${this.name}`,
        email: this.email,
      }).then((resp) => {
        setApiKey(resp.key);
        this.$router.push({ name: "home" });
      }).catch((err) => {
        this.errors.push(err.errors);
      })
    }
  }
}
</script>

<template>
  <div>
    {{errors[errors.length - 1]}}
    <h2>Register Page</h2>
    <h3>Nom</h3>
    <input v-model="name" type="text" placeholder="Nom">
    <h3>Prénom</h3>
    <input v-model="firstname" type="text" placeholder="Prénom">
    <h3>Email</h3>
    <input v-model="email" type="text" placeholder="email">
    <button @click="register">Register</button>
    <RouterLink to="/login">Login</RouterLink>
  </div>
</template>

<style scoped>

</style>
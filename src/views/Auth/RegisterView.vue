<script >
import { useAuthStore } from '@/stores/Auth.js'
import { mapActions, mapState } from 'pinia'
export default {
  computed: {
    //Les variables du stores sont accessibles dans les computed
    ...mapState(useAuthStore, ['apiKey']),
    ...mapState(useAuthStore, ['returnUrl']),
  },
  data() {
    return {
      name: "",
      firstname: "",
      email: "",
      errors: [],
    }
  },
  methods: {
    //Les actions du stores sont accessibles dans les methods
    ...mapActions(useAuthStore, ['setApiKey']),
    register() {
      this.errors = [];
      this.$api.post("apikeys", {
        name: `${this.firstname} ${this.name}`,
        email: this.email,
      }).then((resp) => {
        this.setApiKey(`key=${resp.data.key}`);
        this.$router.push(this.returnUrl || "/");
      }).catch((err) => {
        this.errors.push(err.response.data.errors[0]);
      })
    }
  }
}
</script>

<template>
  <div>
    <h2>Register Page</h2>
    <h3>Nom</h3>
    <input v-model="name" type="text" placeholder="Nom">
    <h3>Prénom</h3>
    <input v-model="firstname" type="text" placeholder="Prénom">
    <h3>Email</h3>
    <input v-model="email" type="text" placeholder="email">
    <button @click="register">Register</button>
    <RouterLink to="/auth/login">Login</RouterLink>
  </div>
</template>

<style scoped>

</style>
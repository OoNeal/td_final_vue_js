<script>
import { useAuthStore } from '@/stores/Auth.js'
import { mapActions, mapState } from 'pinia'
import { toast } from 'vue3-toastify'
import ToastOptions from '../../../toasts/toastOptions.js'
import { useUserProfileStore } from '@/stores/UserProfile.js'

export default {
  computed: {
    ...mapState(useAuthStore, ['apiKey']),
    ...mapState(useAuthStore, ['returnUrl'])
  },
  data() {
    return {
      name: '',
      firstname: '',
      email: '',
    }
  },
  methods: {
    ...mapActions(useAuthStore, ['setApiKey']),
    ...mapActions(useUserProfileStore, ['setName']),
    register() {
      this.$api.post('apikeys', {
        name: `${this.firstname} ${this.name}`,
        email: this.email
      }).then((resp) => {
        this.setName(`${this.firstname} ${this.name}`)
        this.setApiKey(resp.data.key);
        location.reload()
      }).catch((err) => {
        toast.error(err.response.data.errors[0], ToastOptions);
      })
    }
  }
}
</script>

<template>
  <div class="register">
    <h2>Register Page</h2>
    <div class="register_form">
      <h3>Nom</h3>
      <input v-model="name" type="text" placeholder="Nom">
      <h3>Prénom</h3>
      <input v-model="firstname" type="text" placeholder="Prénom">
      <h3>Email</h3>
      <input v-model="email" type="text" placeholder="email">
      <div class="register_form_buttons">
        <RouterLink to="/auth/login">Login</RouterLink>
        <button @click="register">Register</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.register {
  width: 60%;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  & > h2 {
    font-size: 3em;
    font-weight: 300;
    text-transform: uppercase;
  }

  &_form {
    width: 50%;
    margin-top: 1em;

    display: flex;
    flex-direction: column;
    align-items: start;

    & > h3 {
      margin: .5em 0;
      color: #D4DFD8;
      font-size: 1.2em;
      font-weight: 500;
      text-transform: uppercase;
    }

    & > input {
      box-sizing: border-box;

      margin-bottom: 1em;

      width: 100%;
      padding: .5em 1em;

      border: 1px solid rgba(#D4DFD8, 0.35);
      border-radius: 100px;
      background-color: rgba(#D4DFD8, 0.2);

      font-family: 'Montserrat', sans-serif;
      color: #D4DFD8;
      font-size: 1em;
      font-weight: 400;

      &::placeholder {
        text-transform: uppercase;
      }
    }

    &_buttons {
      width: 100%;

      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: baseline;

      & > button {
        box-sizing: border-box;
        padding: 0.5em 1em;
        border: 1px solid rgba(#D4DFD8, 0.35);
        border-radius: 100px;
        background-color: rgba(#D4DFD8, 0.2);
        color: #D4DFD8;

        font-size: 1em;
        font-weight: 500;
      }

      & > a {
        color: #D4DFD8;
        font-size: 1em;
        font-weight: 500;
        text-decoration: none;
      }
    }

  }
}
</style>
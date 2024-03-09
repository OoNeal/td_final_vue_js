<script>
import { useAuthStore } from '@/stores/Auth.js'
import { mapActions, mapState } from 'pinia'
import { useUserProfileStore } from '@/stores/UserProfile.js'
import { toast } from 'vue3-toastify'
import ToastOptions from '../../../toasts/toastOptions.js'

export default {
  computed: {
    ...mapState(useAuthStore, ['apiKey']),
    ...mapState(useAuthStore, ['returnUrl'])
  },
  data() {
    return {
      userKey: ''
    }
  },
  methods: {
    useAuthStore,
    ...mapActions(useAuthStore, ['setApiKey']),
    ...mapActions(useUserProfileStore, ['setName']),
    login() {
      this.$api.get('profile', {
        headers: {
          'Authorization': `key=${this.userKey}`
        }
      }).then((resp) => {
        this.setName(resp.data.name)
        location.reload()
        this.setApiKey(this.userKey)
      }).catch( => {
        toast.error('La clé d\'api est incorrecte', ToastOptions)
      })
    }
  }
}
</script>

<template>
  <div class="login">
    <h2>Se connecter</h2>
    <div class="login_form">
      <h3>Clé d'API</h3>
      <input v-model="userKey">
      <div class="login_form_buttons">
        <RouterLink to="/auth/register">S'inscrire</RouterLink>
        <button @click="login">Se connecter</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login {
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
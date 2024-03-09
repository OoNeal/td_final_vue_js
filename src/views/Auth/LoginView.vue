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
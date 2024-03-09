<script>

import { useUserProfileStore } from '@/stores/UserProfile.js'
import { mapActions } from 'pinia'

export default {
  data() {
    return {
      user: {
        name: '',
        email: '',
        id: ''
      }
    }
  },
  methods: {
    ...mapActions(useUserProfileStore, ['setName']),
    getProfile() {
      return this.$api.get('profile').then((resp) => {
        const profile = resp.data
        this.setName(profile.name)
        return profile
      })
    },
    updateUser() {
      return this.$api.put('profile', this.user).then((resp) => {
        this.setName(this.user.name)
        return resp.data
      })
    }
  },
  created() {
    this.getProfile().then((user) => {
      this.user = user
    })

  }
}

</script>

<template>
  <div class="profile">
    <div class="profile_header">
      <h1>Mon profil</h1>
      <hr />
    </div>

    <div class="profile_form">
      <div class="profile_form_input">
        <h3>Nom / Prénom</h3>
        <input type="text" v-model="user.name">
      </div>
      <div class="profile_form_input">
        <h3>Email</h3>
        <input type="text" v-model="user.email">
      </div>
      <div class="profile_button">
        <button @click="updateUser">Enregistrer</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">


.profile {
  width: 100vw;

  &_header {
    margin-bottom: 4em;
    padding-left: 2em;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    & > h1 {
      margin: 0;
      color: #D4DFD8;
      font-size: 2em;
      font-weight: 300;
      text-transform: uppercase;
    }

    & > hr {
      margin: 0;
      border: 1px solid #D4DFD8;
      width: 30%;
    }
  }

  &_form {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    &_input {
      width: 35%;

      & > h3 {
        margin: .5em 0;
        color: #D4DFD8;
        font-size: 1.2em;
        font-weight: 500;
        text-transform: uppercase;
      }

      & > input {
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
      }
    }
  }

  &_button {
    margin-top: 1em;
    width: 35%;

    display: flex;
    flex-direction: row;
    justify-content: right;

    & > button {
      padding: 1em 2em;
      border: 1px solid rgba(#D4DFD8, 0.35);
      border-radius: 100px;
      background-color: rgba(#D4DFD8, 0.2);
      color: #D4DFD8;

      font-size: 1em;
      font-weight: 500;
    }
  }
}
</style>
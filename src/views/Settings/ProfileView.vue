<script>

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
    getProfile() {
      return this.$api.get('profile').then((resp) => {
        return resp.data
      })
    },
    updateUser() {
      return this.$api.put('profile', this.user).then((resp) => {
        console.log('user updated')
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
  <div>
    <h1>Mon profil</h1>
    <h3>Nom / Prénom</h3>
    <input type="text" v-model="user.name">
    <h3>Email</h3>
    <input type="text" v-model="user.email">
    <button @click="updateUser">Enregistrer</button>
  </div>
</template>

<style scoped>

</style>
<template>
  <v-app>
    <v-toolbar
      app>

      <v-toolbar-items >

        <v-btn exact="" flat to="/">
          Phone Book
        </v-btn>

        <v-btn exact="" flat @click="toTestPage">
          Test Page
        </v-btn>

      </v-toolbar-items>

      <v-spacer/>


      <v-toolbar-items >
        <v-btn v-if="!isAuth" flat  @click="openRegisterModal">
          <v-icon left>account_circle</v-icon>
          Registration
        </v-btn>
        <v-btn v-if="!isAuth" flat @click="openLoginModal">
          <v-icon left>account_circle</v-icon>
          Login
        </v-btn>

        <v-btn v-if="isAuth" flat @click="logOut">
          <v-icon left>account_circle</v-icon>
          LogOut
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-content>
      <router-view/>
    </v-content>

    <app-login
      :modal='login'
      @close='closeLoginModal'
    />

    <app-registration
      :modal='register'
      @close='closeRegisterModal'
    />

    <v-footer app>
      <span>&copy; {{ todayYear }}</span>
    </v-footer>
  </v-app>
</template>

<script>
  import appLogin from '@/components/app-login'
  import appRegistration from '@/components/registration'

  export default {
    components: {
      appLogin,
      appRegistration
    },
    data() {
      return {
        login: false,
        register: false,
      }
    },
    methods: {
      openLoginModal () {
        this.login = true
      },

      closeRegisterModal () {
        this.register = false
      },
      openRegisterModal () {
        this.register = true
      },

      closeLoginModal () {
        this.login = false
      },
      logOut() {
        this.$store.dispatch('logOut')
      },
      toTestPage () {
        if (this.isAuth) {
          this.$router.push('/test')
        } else {
          this.openLoginModal()
        }
      }
    },
    computed: {
      todayYear() {
        return new Date().getFullYear()
      },

      isAuth() {
        return this.$store.getters.isAuth
      }
    },
    name: 'App',
    watch: {
      isAuth (v) {
        if(v) {
          this.login = false
        }
      }
    }
  }
</script>

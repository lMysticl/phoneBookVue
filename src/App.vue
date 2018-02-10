<template>
  <v-app>
    <v-toolbar
      app>

      <v-toolbar-items class="hidden-sm-and-down">

        <v-btn exact="" flat to="/">
          Phone Book
        </v-btn>

        <v-btn exact="" flat @click="toTestPage">
          Test Page
        </v-btn>

      </v-toolbar-items>

      <v-spacer/>

      <v-toolbar-items class="hidden-sm-and-down">
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

    <v-footer app>
      <span>&copy; {{ todayYear }}</span>
    </v-footer>
  </v-app>
</template>

<script>
  import appLogin from '@/components/app-login'

  export default {
    components: {
      appLogin
    },
    data() {
      return {
        login: false,
      }
    },
    methods: {
      openLoginModal () {
        this.login = true
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

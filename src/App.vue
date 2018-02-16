<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      fixed
      temporary
      app
      disable-resize-watcher
    >
      <v-list>
        <v-list-tile avatar @click="openRegisterModal">
          <v-list-tile-avatar v-if="!isAuth" >
            <v-icon>fa-user-plus</v-icon>
          </v-list-tile-avatar>

          <v-list-tile-content v-if="!isAuth">
            <v-list-tile-title>Registration</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile avatar @click="openLoginModal">
          <v-list-tile-avatar v-if="!isAuth">
            <v-icon >fa-sign-in</v-icon>
          </v-list-tile-avatar>

          <v-list-tile-content v-if="!isAuth">
            <v-list-tile-title>Login</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile  avatar @click="logOut">
          <v-list-tile-avatar v-if="isAuth">
            <v-icon>fa-sign-out</v-icon>
          </v-list-tile-avatar>

          <v-list-tile-content v-if="isAuth">
            <v-list-tile-title>LogOut</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-divider/>

        <v-list-tile avatar @click="toTestPage">
          <v-list-tile-avatar>
            <v-icon>fa-sign-out</v-icon>
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title>Test page</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar
      app>

      <v-toolbar-side-icon class="hidden-sm-and-up" @click="drawer = !drawer"/>

      <v-toolbar-title class="hidden-sm-and-up">Phone Book</v-toolbar-title>

      <v-toolbar-items class="hidden-xs-only">

        <v-btn exact="" flat to="/">
          Phone Book
        </v-btn>

        <v-btn exact="" flat @click="toTestPage">
          Test Page
        </v-btn>

      </v-toolbar-items>

      <v-spacer/>

      <v-toolbar-items class="hidden-xs-only">
        <v-btn v-if="!isAuth" flat  @click="openRegisterModal">
          <v-icon left>fa-user-plus</v-icon>
          Registration
        </v-btn>

        <v-btn v-if="!isAuth" flat @click="openLoginModal">
          <v-icon left>fa-sign-in</v-icon>
          Login
        </v-btn>

        <v-btn v-if="isAuth" flat @click="logOut">
          <v-icon left>fa-sign-out</v-icon>
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
      <span>&copy; dantedimon and mystic || {{ todayYear }} || &copy; </span>
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
        drawer: false,
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
    // watch: {
    //   isAuth (v) {
    //     if(v) {
    //       this.login = false
    //     }
    //   }
    // }
  }
</script>

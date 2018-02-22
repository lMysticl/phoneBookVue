<template>
  <v-app dark >
    <v-navigation-drawer
      v-model="drawer"
      fixed
      temporary
      app
      disable-resize-watcher
    >
      <v-list>
        <v-list-tile v-if="!isAuth" avatar @click="openRegisterModal">
          <v-list-tile-avatar>
            <v-icon>fa-user-plus</v-icon>
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title>Registration</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile v-if="!isAuth" avatar @click="openLoginModal">
          <v-list-tile-avatar>
            <v-icon >fa-sign-in</v-icon>
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title>Login</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile v-if="isAuth" avatar @click="logOut">
          <v-list-tile-avatar>
            <v-icon>fa-sign-out</v-icon>
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title>LogOut</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-divider/>

        <v-list-tile avatar @click="toTestPage">
          <v-list-tile-avatar>
            <v-icon>fa-sign-out</v-icon>
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title>Contacts page</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile avatar to="/">
          <v-list-tile-avatar>
            <v-icon>fa-sign-out</v-icon>
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title>Phone Book</v-list-tile-title>
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
          Contacts Page
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
      <span class="pl-4">&copy; dantedimon and mystic | {{ todayYear }} | &copy; </span>
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
          this.$router.push('/contacts')
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


<style>
  .content--wrap {
    background-image: url("/static/material-wallpaper-2560x1024.jpg");
    background-attachment: fixed;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
</style>

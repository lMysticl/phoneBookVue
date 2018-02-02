<template>
  <v-app>
    <v-toolbar
      app>
      <v-toolbar-title>Phone book</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn flat @click="openLoginModal">
          <v-icon left>account_circle</v-icon>Login
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-content>
      <app-login
        :modal = 'login'
        @close = 'closeLoginModal'
      ></app-login>
    </v-content>

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
        login: true
      }
    },
    methods: {
      openLoginModal () {
        this.login = true
      },

      closeLoginModal () {
        this.login = false
      },
    },
    computed: {
      todayYear() {
        return new Date().getFullYear()
      }
    },
    name: 'App'
  }
</script>

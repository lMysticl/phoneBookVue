<template>
  <v-dialog v-model="modal" persistent max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">Login</span>
      </v-card-title>

      <v-divider/>


      <v-card-text>

        <v-alert
          @input= "clearInfo"
          type="info"
          dismissible
          :value= "info"
          transition= "scale-transition"
          outline
        >
          In the first request to the Heroku server, there can be delays which disappear in next request.
        </v-alert>

        <v-alert
          @input="clearError"
          type="error"
          dismissible
          v-model="error"
          transition="scale-transition"
        >
          {{ errorMessage }}
        </v-alert>

        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12>
              <v-text-field
                :disabled="loading"
                id="username"
                label="Username"
                v-model="credentials.username"
                required
                prepend-icon="perm_identity"
              />
            </v-flex>

            <v-flex xs12>
              <v-text-field
                :disabled="loading"
                id="password"
                label="Password"
                v-model="credentials.password"
                required
                type="password"
                prepend-icon="lock_open"
              />
            </v-flex>
          </v-layout>
        </v-container>
        <small>*indicates required field</small>
      </v-card-text>
      <v-divider/>
      <v-card-actions>
        <v-spacer/>
        <v-btn color="blue darken-1" @click="close" flat :disabled="loading">close</v-btn>
        <v-btn color="blue darken-1" @click="login" flat :loading="loading">login</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>


  export default {
    props: {
      modal: Boolean
    },
    data: () => ({
      credentials: {
        username: '',
        password: ''
      },
      error: false,
      errorMessage: null,
      loading: false
    }),
    computed: {
      info() {
        return this.$store.getters.infoShowed
      }
    },
    methods: {
      close() {
        this.$emit('close');
        this.clearError();
        this.clean();
      },
      clearError() {
        this.errorMessage = null
      },
      clearInfo() {
        this.$store.commit('setInfo', false)
      },
      clean() {
        this.credentials.username = "";
        this.credentials.password = "";
      },
      login() {
        let formData = new FormData();

        formData.append('grant_type', 'password');
        formData.append('username', this.credentials.username);
        formData.append('password', this.credentials.password);

        this.loading = true;

        this.$store.dispatch('login', {
          credentials: this.credentials,
          formData: formData,
          redirect: 'contacts'
        })
          .then(() => {
            this.loading = false;
            this.close();
            this.clean();
          })
          .catch((error) => {
            this.error = true;
            this.loading = false;
            this.errorMessage = error.body.error_description;
          })

      }
    }
  }
</script>

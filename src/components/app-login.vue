<template>
  <v-layout row justify-center>
    <v-dialog v-model="modal" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Login</span>
        </v-card-title>

        <v-divider/>

        <v-alert
          @input="clearError"
          type="error"
          dismissible
          v-model="error"
          transition="scale-transition"
        >
          {{ errorMessage }}
        </v-alert>

        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field
                  id="username"
                  label="Username"
                  v-model="credentials.username"
                  required
                  prepend-icon="perm_identity"
                />
              </v-flex>

              <v-flex xs12>
                <v-text-field
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
          <v-btn color="blue darken-1" @click="close" flat>close</v-btn>
          <v-btn color="blue darken-1" @click="login" flat>login</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>


  export default {
    props: {
      modal: Boolean
    },
    data: () => ({
      credentials: {
        username: null,
        password: null
      },
      error: false,
      errorMessage: null
    }),
    methods: {
      close() {
        this.$emit('close')
      },
      clearError () {
        this.errorMessage = null
      },
      login() {
        let formData = new FormData();

        formData.append('grant_type', 'password');
        formData.append('username', this.credentials.username);
        formData.append('password',  this.credentials.password);

        this.$store.dispatch('login', {
          credentials : this.credentials,
          formData : formData,
          redirect : 'test'
        })
          .then(() => {
            console.log('Login was successful!!!!!!!');
            this.close()
        })
          .catch((error) => {
            this.error = true;
            this.errorMessage = error.body.error_description
        })

      }
    }
  }
</script>

<template>
  <v-layout row justify-center>
    <v-dialog v-model="modal" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Registration</span>
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
                  id="reg_username"
                  label="Username"
                  v-model="register.username"
                  prepend-icon="perm_identity"
                />
              </v-flex>

              <v-flex xs12>
                <v-text-field
                  id="firstname"
                  label="First name*"
                  v-model="register.firstname"
                  prepend-icon="lock_open"
                />
              </v-flex>


              <v-flex xs12>
                <v-text-field
                  id="reg_password"
                  label="Password"
                  v-model="register.password"
                  type="password"
                  prepend-icon="lock_open"
                />
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  id="middlename"
                  label="Middle name*"
                  v-model="register.middlename"
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
          <v-btn color="blue darken-1" @click="registration" flat>registration</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>

  import authServices from '@/services/auth'

  export default {
    props: {
      modal: Boolean
    },

    data: () => ({
      register:{},
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
      registration() {
        this.$store.dispatch('registration', {
          data: this.register
        })
          .then(() => {
            console.log('Registration was successful!!!!!!!');
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

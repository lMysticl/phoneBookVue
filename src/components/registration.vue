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
          <v-form v-model="valid" ref="form" lazy-validation>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field
                  id="reg_username"
                  label="Username"
                  v-model="register.username"
                  prepend-icon="perm_identity"
                  :rules="usernameRules"
                  :disabled="loading"
                  required
                />
              </v-flex>

              <v-flex xs12>
                <v-text-field
                  id="firstname"
                  label="First name"
                  v-model="register.firstname"
                  prepend-icon="face"
                  :rules="firstnameRules"
                  :disabled="loading"
                />
              </v-flex>


              <v-flex xs12>
                <v-text-field
                  id="reg_password"
                  v-model="register.password"
                  type="password"
                  prepend-icon="lock_open"
                  name="input-10-2"
                  label="Enter your password"
                  hint="At least 4 characters"
                  required
                  min="4"
                  :append-icon="e3 ? 'visibility' : 'visibility_off'"
                  :append-icon-cb="() => (e3 = !e3)"
                  class="input-group--focused"
                  :type="e3 ? 'password' : 'text'"
                  :rules="passwordRules"
                  :disabled="loading"
                />
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  id="middlename"
                  label="Middle name"
                  v-model="register.middlename"
                  prepend-icon="person"
                  :rules="middlenameRules"
                  :disabled="loading"
                />
              </v-flex>

            </v-layout>
          </v-container>
          <small>*indicates required field</small>
          </v-form>
        </v-card-text>
        <v-divider/>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="blue darken-1" flat @click="close" :disabled="loading">close</v-btn>
          <v-btn color="blue darken-1" flat @click="registration" :disabled="!valid" :loading="loading">Registration</v-btn>
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

      register:{},
      error: false,
      errorMessage: "",
      e3: true,
      loading: false,
      password: 'Password',
      usernameRules: [
        v => !!v || 'This field is required',
        v => (v && v.length > 2) || 'This field must be more then two characters',
      ],
      passwordRules: [
        v => !!v || 'This field is required',
        v => (v && v.length > 4) || 'This field must be more then 4 characters',
      ]
    }),
    methods: {
      close() {


        this.$emit('close')
      },
      clearError () {
        this.errorMessage = null
      },

      registration() {

        if(this.$refs.form.validate()){
        this.loading = true;
          console.log('!!!!!!!');
          console.log(this.register);
        this.$store.dispatch('registration', {
          data: this.register
        })
          .then(() => {
            this.loading = false;
            console.log('Registration was successful!!!!!!!');
            console.log(this.register.username + this.register.password);
            this.close();

          })
          .catch((error) => {
            this.error = true;
            this.errorMessage = error.body.error_description
        })
        }

      }
    },

    computed: {
      middlenameRules () {
        if (this.register.middlename) {
          return [
            v => (v && v.length > 2) || 'This field must be more then two characters',
          ]
        }
      },


      firstnameRules () {
        if (this.register.firstname) {
          return [
            v => (v && v.length > 2) || 'This field must be more then two characters',
          ]
        }
      },
      valid: {
        get () {

          return !!this.register.username && !!this.register.password
        },
        set (v)  {

        }
      }
    },
  }
</script>

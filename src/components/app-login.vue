<template>
  <v-layout row justify-center>
    <v-dialog v-model="modal" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Login</span>
        </v-card-title>
        <v-divider/>
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

  import authServices from '@/services/auth'

  export default {
    props: {
      modal: Boolean
    },
    data: () => ({
      credentials: {
        username: null,
        password: null
      }
    }),
    methods: {
      close() {
        this.$emit('close')
      },
      login() {
        let formData = new FormData();

        formData.append('grant_type', 'password');
        formData.append('username', 'admin.admin');
        formData.append('password', 'jwtpass');

        this.$store.dispatch('login', {
          credentials : this.credentials,
          formData : formData,
          redirect : 'test'
        }).then(() => {
          console.log('Login was successful!!!!!!!');
          this.close()
        })

      }
    }
  }
</script>

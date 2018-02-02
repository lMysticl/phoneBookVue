<template>
  <v-layout row justify-center>
    <v-dialog v-model="modal" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Login</span>
        </v-card-title>
        <v-divider></v-divider>
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
                ></v-text-field>
              </v-flex>

              <v-flex xs12>
                <v-text-field
                  id="password"
                  label="Password"
                  v-model="credentials.password"
                  required
                  type="password"
                  prepend-icon="lock_open"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
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
      }
    }),
    methods: {
      close () {
        this.$emit('close')
      },
      login () {
        let formData = new FormData();
        formData.append('username', this.credentials.username);
        formData.append('password', this.credentials.password);

        this.$http.post('http://localhost:8002/login', formData)
          .then(res => console.log(res))
      }
    }
  }
</script>

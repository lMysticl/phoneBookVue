<template>
  <v-container>
    <v-layout align-center justify-center>
      <v-flex style="max-width: 600px">
        <v-card>
          <v-card-title>
            <span class="headline">User Profile</span>
          </v-card-title>

          <v-divider/>

          <v-tabs grow>
            <v-tab>General</v-tab>

            <v-tab>password</v-tab>

            <v-tab-item>
              <v-divider/>
              <v-card-text>

                <v-alert
                  @input="clearError1"
                  type="error"
                  dismissible
                  v-model="error1"
                  transition="scale-transition"
                >
                  {{ errorMessage1 }}
                </v-alert>

                <v-form v-model="valid1" ref="form1">
                  <v-container grid-list-md>
                    <v-layout align-center column>
                      <div class="pa-4 text-xs-center">
                        <v-avatar size="128">
                          <img ref="avatar" :src="user.avatar" alt="avatar">
                        </v-avatar>
                      </div>
                      <div class="text-xs-center">
                        <input type="file" accept="image/png" ref="file" @change="onFilePickUp" style="display: none">
                        <v-btn color="blue darken-3" @click="pickUpFile">
                          Select image
                        </v-btn>
                      </div>
                    </v-layout>

                    <v-layout wrap>
                      <v-flex xs12>
                        <v-text-field
                          label="Username"
                          v-model="user.username"
                          prepend-icon="perm_identity"
                          :rules="usernameRules"
                          :disabled="loading1"
                          required
                        />
                      </v-flex>

                      <v-flex xs12>
                        <v-text-field
                          label="First name"
                          v-model="user.firstname"
                          prepend-icon="face"
                          :rules="firstnameRules"
                          :disabled="loading1"
                        />
                      </v-flex>

                      <v-flex xs12>
                        <v-text-field
                          label="Last name"
                          v-model="user.lastname"
                          prepend-icon="face"
                          :rules="lastnameRules"
                          :disabled="loading1"
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

                <v-btn color="blue darken-1" flat @click="updateProfile" :disabled="!valid1 || !setBackup" :loading="loading1">
                  Save
                </v-btn>
              </v-card-actions>
            </v-tab-item>

            <v-tab-item>
              <v-divider/>
              <v-card-text>

                <v-alert
                  @input="clearError2"
                  type="error"
                  dismissible
                  v-model="error2"
                  transition="scale-transition"
                >
                  {{ errorMessage2 }}
                </v-alert>

                <v-form v-model="valid2" ref="form2">
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-flex xs12>
                        <v-text-field
                          v-model="oldPassword"
                          type="password"
                          prepend-icon="lock"
                          label="Enter your old password"
                          required
                          min="4"
                          :append-icon="pass1 ? 'visibility' : 'visibility_off'"
                          :append-icon-cb="() => (pass1 = !pass1)"
                          :type="pass1 ? 'password' : 'text'"
                          :rules="passwordRules"
                          :disabled="loading2"
                        />

                      </v-flex>

                      <v-flex xs12>
                        <v-text-field
                          v-model="newPassword"
                          type="password"
                          prepend-icon="lock_outline"
                          label="Enter your new password"
                          required
                          min="4"
                          :append-icon="pass2 ? 'visibility' : 'visibility_off'"
                          :append-icon-cb="() => (pass2 = !pass2)"
                          :type="pass2 ? 'password' : 'text'"
                          :rules="passwordRules"
                          :disabled="loading2"
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

                <v-btn color="blue darken-1" flat @click="changePassword" :disabled="!valid2" :loading="loading2">
                  Save
                </v-btn>
              </v-card-actions>
            </v-tab-item>
          </v-tabs>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

  import tokenService from '@/services/token'

  const api_url = 'http://localhost:8080/';

  const profile_url = api_url + 'api/profile';

  const nameRegex = /^[a-zA-Z\\s]*$/;

  const login = /^[a-zA-Z0-9]*$/;


  export default {
    data: () => ({
      user: {},

      error1: false,
      error2: false,

      errorMessage1: "",
      errorMessage2: "",

      pass1: true,
      pass2: true,

      loading1: false,
      loading2: false,

      valid1: false,
      valid2: false,

      oldPassword: null,
      newPassword: null,

      usernameRules: [
        v => !!v || 'This field is required',
        v => (v && v.length > 2) && login.test(v) || 'This field must be more then two characters ',
      ],
      passwordRules: [
        v => !!v || 'This field is required',
        v => (v && v.length > 4) || 'This field must be more then 4 characters',
      ]
    }),
    watch: {
      profile (v) {
        if (v) this.setValues ();
      }
    },
    mounted () {
      this.setValues ();
    },
    methods: {
      clearError1() {
        this.errorMessage1 = null;
        this.error1 = false;
      },
      clearError2() {
        this.errorMessage2 = null
        this.error2 = false
      },
      clean1() {
        this.$refs.form1.reset();
      },
      clean2() {
        this.$refs.form2.reset();
      },
      pickUpFile() {
        this.$refs.file.click()
      },

      onFilePickUp() {
        let avatar = this.$refs.avatar;
        let file    = this.$refs.file.files[0];
        let reader  = new FileReader();

        reader.onloadend = () => {
          avatar.src = reader.result;
          this.user.avatar = reader.result;
        };

        if (file) {
          reader.readAsDataURL(file);
        } else {
          avatar.src = "";
        }

      },
      setValues () {
        this.user = Object.assign({}, this.profile);
      },

      updateProfile() {

        if (this.valid1) {
          this.clearError1();
          this.loading1 = true;
          this.$store.dispatch('updateProfile', {
            data: this.user
          })
            .then(() => {
              this.loading1 = false;
              if (this.profile.username !== this.user.username) {
                this.$store.dispatch('logOut')
              } else {
                this.$store.commit('setUser', this.user);
              }
            })
            .catch((error) => {
              this.error1 = true;
              this.errorMessage1 = error.body.message;
              this.loading1 = false;
            })
        }

      },

      changePassword () {
        if (this.valid1) {
          this.loading2 = true;
          this.$store.dispatch('changePassword', {
            oldPassword: this.oldPassword,
            newPassword: this.newPassword
          })
            .then(() => {
              this.loading2 = false;
              this.clean2();
              this.clearError2();
            })
            .catch((error) => {
              this.error2 = true;
              this.errorMessage2 = error.body.message;
              this.loading2 = false;
            })
        }
      }
    },

    computed: {
      profile () {
        return this.$store.getters.user
      },

      firstnameRules() {
        if (this.user.firstname) {
          return [
            v => (v && v.length > 2) && nameRegex.test(v) || 'This field must be more then two characters and only letters',
          ]
        }
      },
      lastnameRules() {
        if (this.user.lastname) {
          return [
            v => (v && v.length > 2) && nameRegex.test(v) || 'This field must be more then two characters and only letters',
          ]
        }
      },
      setBackup() {
        return this.profile.username !== this.user.username ||
          this.profile.lastname !== this.user.lastname ||
          this.profile.firstname !== this.user.firstname ||
          this.profile.avatar !== this.user.avatar
      }
    }
  }
</script>

<style scoped>

</style>

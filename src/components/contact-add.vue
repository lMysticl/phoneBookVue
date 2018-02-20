<template>
  <v-dialog v-model="modal" persistent scrollable max-width="450px">

    <v-btn slot="activator" color="blue" dark>new contact</v-btn>

    <v-card>
      <v-card-title>
        <span class="headline">Contact data</span>
      </v-card-title>

      <div class="pl-4 pb-2">
        <small>* - required fields</small>
      </div>

      <v-divider/>

      <v-card-text style="max-height: 400px">
        <v-form v-model="valid" ref="form" lazy-validation>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field
                  label="First name"
                  v-model="firstname"
                  :rules="firstnameRules"
                  :disabled="loading"
                  required
                />
              </v-flex>

              <v-flex xs12>
                <v-text-field
                  label="Last name"
                  v-model="lastname"
                  :rules="lastnameRules"
                  :disabled="loading"
                />
              </v-flex>

              <v-flex xs12>
                <v-text-field
                  label="Middle name"
                  v-model="middlename"
                  :rules="middlenameRules"
                  :disabled="loading"
                />
              </v-flex>
              <v-select
                label="Country"
                v-model="country"
                :items="countries"
                @change="updateMask"
              />

              <v-flex xs12>
                <v-text-field
                  label="Mobile phone"
                  v-model="mobilePhone"
                  :rules="mobilePhoneRules"
                  type="tel"
                  :disabled="loading"
                  required
                  :mask="phoneMasks[country]"
                  :hint="phoneMasks[country]"
                />
              </v-flex>

              <v-flex xs12>
                <v-text-field
                  label="Home phone"
                  v-model="homePhone"
                  :rules="homePhoneRules"
                  :disabled="loading"
                  :mask="phoneMasks[country]"
                  :hint="phoneMasks[country]"
                  type="tel"
                />
              </v-flex>

              <v-flex xs12>
                <v-text-field
                  label="Address"
                  v-model="address"
                  :rules="addressRules"
                  :disabled="loading"
                />
              </v-flex>

              <v-flex xs12>
                <v-text-field
                  label="Email"
                  v-model="email"
                  :rules="emailRules"
                  :disabled="loading"
                />
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
      </v-card-text>

      <v-divider/>

      <v-card-actions>
        <v-spacer/>
        <v-btn color="blue darken-1" flat @click.native="close" :disabled="loading">Close</v-btn>
        <v-btn color="blue darken-1" flat @click.native="save" :disabled="!valid" :loading="loading">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  const api_url = 'https://vuejs-phone-book.herokuapp.com/';
  import tokenService from '@/services/token'
  import phoneMasks from '@/phoneMasks'

  export default {
    data: () => ({
      modal: false,
      firstname: "",
      middlename: "",
      lastname: "",
      address: "",
      phoneMasks: phoneMasks,
      email: "",
      country: 'Australia',
      homePhone: "",
      mobilePhone: "",
      loading: false,
      error: false,
      errorMessage: null,
      firstnameRules: [
        v => !!v || 'This field is required',
        v => (v && v.length > 2) || 'This field must be more then two characters',
      ],
      mobilePhoneRules: [
        v => !!v || 'This field is required',
        v => (v && v.length > 2) || 'This field must be more then two characters',
      ]
    }),
    computed: {
      countries () {
        let countries = [];

        for (let c in this.phoneMasks) {
          countries.push(c)
        }

        return countries
      },
      lastnameRules () {
        if (this.lastname) {
          return [
            v => (v && v.length > 2) || 'This field must be more then two characters',
          ]
        }
      },
      middlenameRules () {
        if (this.middlename) {
          return [
            v => (v && v.length > 2) || 'This field must be more then two characters',
          ]
        }
      },
      homePhoneRules () {
        if (this.homePhone) {
          return [
            v => (v && v.length > 2) || 'This field must be more then two characters',
          ]
        }
      },
      addressRules () {
        if (this.address) {
          return [
            v => (v && v.length > 2) || 'This field must be more then two characters',
          ]
        }
      },
      emailRules () {
        if (this.email) {
          return [
            v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid',
          ]
        }
      },
      valid: {
        get () {
          return !!this.firstname && !!this.mobilePhone
        },
        set (v)  {

        }
      }
    },
    methods: {
      updateMask () {
        if (this.country) {
          setTimeout(() => {
            this.homePhone = this.phoneMasks[this.country].replace(/#/g, '');
            this.mobilePhone = this.phoneMasks[this.country].replace(/#/g, '');
          }, 50)
        }
      },
      close() {
        this.modal = false;
        this.clean();

      },
      clean() {
        this.$refs.form.reset();
        this.firstname = "";
        this.lastname = "";
        this.middlename = "";
        this.address = "";
        this.country = "";
        this.email = "";
        this.homePhone = "";
        this.mobilePhone = ""
      },

      open() {
        this.modal = true
      },
      save() {
        if(this.$refs.form.validate()){
          let form = new FormData();

          form.append('firstname', this.firstname);
          form.append('lastname', this.lastname);
          form.append('middlename', this.middlename);
          form.append('country', this.country);
          form.append('address', this.address);
          form.append('email', this.email);
          form.append('homePhone', this.homePhone);
          form.append('mobilePhone', this.mobilePhone);

          this.loading = true;

          this.$http.post(api_url + 'contacts/add', form,
            {
              headers: {
                'Authorization': tokenService.getAuthHeader()
              }
            })
            .then(() => {
              this.loading = false;
              this.close();
              this.$emit('update');
              this.clean();
            }).catch((error) => {
            this.loading = false;
          })

        }

      }
    }
  }
</script>

<style scoped>

</style>

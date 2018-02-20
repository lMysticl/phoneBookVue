<template>
  <v-dialog v-model="modal" persistent scrollable max-width="450px">
    <v-card>
      <v-card-title>
        <span class="headline">Contact data</span>
      </v-card-title>

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
                  ref="mobilePhone"
                  :rules="mobilePhoneRules"
                  :disabled="loading"
                  :mask="phoneMasks[country]"
                  :hint="phoneMasks[country]"
                  type="tel"
                />
              </v-flex>

              <v-flex xs12>
                <v-text-field
                  label="Home phone"
                  v-model="homePhone"
                  ref="homePhone"
                  :rules="homePhoneRules"
                  :disabled="loading"
                  type="tel"
                  :mask="phoneMasks[country]"
                  :hint="phoneMasks[country]"
                />
              </v-flex>

              <v-flex xs12>
                <v-text-field
                  label="Address"
                  :disabled="loading"
                  :rules="addressRules"
                  v-model="address"
                />
              </v-flex>

              <v-flex xs12>
                <v-text-field
                  label="Email"
                  :disabled="loading"
                  :rules="emailRules"
                  v-model="email"
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
        <v-btn color="blue darken-1" flat @click.native="save" :disabled="!valid || ! update" :loading="loading">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import tokenService from '@/services/token'
  import phoneMasks from '@/phoneMasks'

  const api_url = 'https://vuejs-phone-book.herokuapp.com/';

  export default {
    props: ['contact'],
    data: () => ({
      modal: false,
      country: 'Australia',
      phoneMasks: phoneMasks,
      loading: false,
      contactId: "",
      firstname: "",
      middlename: "",
      lastname: "",
      address: "",
      email: "",
      homePhone: "",
      mobilePhone: "",
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
      lastnameRules() {
        if (this.lastname) {
          return [
            v => (v && v.length > 2) || 'This field must be more then two characters',
          ]
        }
      },
      middlenameRules() {
        if (this.middlename) {
          return [
            v => (v && v.length > 2) || 'This field must be more then two characters',
          ]
        }
      },
      homePhoneRules() {
        if (this.homePhone) {
          return [
            v => (v && v.length > 2) || 'This field must be more then two characters',
          ]
        }
      },
      addressRules() {
        if (this.address) {
          return [
            v => (v && v.length > 2) || 'This field must be more then two characters',
          ]
        }
      },
      emailRules() {
        if (this.email) {
          return [
            v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid',
          ]
        }
      },
      update () {
        return this.contact.firstname !== this.firstname ||
          this.contact.middlename !== this.middlename||
          this.contact.lastname !== this.lastname||
          this.contact.address !== this.address||
          this.contact.email !== this.email||
          this.contact.homePhone !== this.homePhone||
          this.contact.mobilePhone !== this.mobilePhone

      },
      valid: {
        get() {
          return !!this.firstname && !!this.mobilePhone
        },
        set(v) {
        }
      }},
      methods: {
        updateMask () {
          if (this.country) {
            setTimeout(() => {
              this.homePhone = this.phoneMasks[this.country].replace(/#/g, '');
              this.mobilePhone = this.phoneMasks[this.country].replace(/#/g, '');
            }, 50)
          }
        },
        setValues() {
          this.contactId = this.contact.contactId;
          this.firstname = this.contact.firstname;
          this.middlename = this.contact.middlename;
          this.lastname = this.contact.lastname;
          this.address = this.contact.address;
          this.email = this.contact.email;
          this.homePhone = this.contact.homePhone;
          this.mobilePhone = this.contact.mobilePhone;
        },
        close() {
          this.modal = false;
          this.clean();
          this.$emit('close')
        },
        clean() {
          this.$refs.form.reset();
          this.firstname = "";
          this.lastname = "";
          this.middlename = "";
          this.address = "";
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

          form.append('contactId', this.contactId);
          form.append('firstname', this.firstname);
          form.append('lastname', this.lastname);
            form.append('middlename', this.middlename);
            form.append('country', this.country);
            form.append('address', this.address);
            form.append('email', this.email);
            form.append('homePhone', this.homePhone);
            form.append('mobilePhone', this.mobilePhone);

          this.loading = true;

          this.$http.post(api_url + 'contacts/update', form,
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
      },
      watch: {
        contact(v) {
          if (Object.keys(v).length) {
            this.open();
            this.setValues()
          }
        }
      }
    }

</script>

<style scoped>

</style>

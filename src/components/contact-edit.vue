<template>
  <v-dialog v-model="modal" persistent scrollable max-width="450px">
    <v-card>
      <v-card-title>
        <span class="headline">Contact data</span>
      </v-card-title>

      <v-divider/>

      <v-card-text>
        <v-alert
          @input="clearError"
          type="error"
          dismissible
          v-model="error"
          transition="scale-transition"
        >
          <div v-for="err in errors">
            {{ err }}
          </div>
        </v-alert>


        <v-form v-model="valid" ref="form">
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


              <v-select
                label="Country"
                v-model="country"
                :items="countries"
                @input="updateMask"
              />

              <v-flex xs12>
                <v-text-field
                  label="Mobile phone"
                  v-model="mobilePhone"
                  ref="mobilePhone"
                  :rules="mobilePhoneRules"
                  :disabled="loading"
                  return-masked-value
                  :mask="phoneMasks[country]"
                  :hint="phoneMasks[country]"
                  type="tel"
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
        <v-btn color="blue darken-1" flat @click.native="save" :disabled="!valid || ! update" :loading="loading">Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

  import tokenService from '@/services/token'

  import phoneMasks from '@/phoneMasks'

  const api_url = 'https://vuejs-phone-book-v1.herokuapp.com/';

  const nameRegex = /^[a-zA-Z\\s]*$/;

  const addressRegex = /[а-яА-ЯёЁA-Za-z0-9'\.\-\s\,]/;

  const phoneNumber =/^(\(?\+?[0-9]*\)?)?[0-9_\- \(\)]*$/;

  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,4})+$/;


  export default {
    props: ['contact'],
    data: () => ({
      modal: false,
      country: '',
      valid: false,
      errors: [],
      error: false,

      phoneMasks: phoneMasks,
      loading: false,
      contactId: "",
      firstname: "",
      lastname: "",
      address: "",
      email: "",
      mobilePhone: "",

      firstnameRules: [
        v => !!v || 'This field is required',

        v => (v && v.length > 2) && nameRegex.test(v) || 'This field must be more then two characters and only letters',
      ],
      mobilePhoneRules: [
        v => !!v || 'This field is required',
        v => (v && v.length > 8)  && phoneNumber.test(v) || 'This field must be more eight two numbers and only numbers',
      ]
    }),
    computed: {
      countries() {

        let countries = [];

        for (let c in this.phoneMasks) {
          countries.push(c)
        }

        return countries
      },
      lastnameRules() {
        if (this.lastname) {

          return [
            v => (v && v.length > 2) && nameRegex.test(v) || 'This field must be more then two characters and only letters',
          ]
        }
      },
      addressRules() {
        if (this.address) {

          return [
            v => (v && v.length > 2) && addressRegex.test(v) || 'This field must be more then two characters',
          ]
        }
      },
      emailRules() {
        if (this.email) {
          return [
            v => emailRegex.test(v) || 'E-mail must be valid',
          ]
        }
      },
      update() {
        return this.contact.firstname !== this.firstname ||
          this.contact.lastname !== this.lastname ||
          this.contact.address !== this.address ||
          this.contact.email !== this.email ||
          this.contact.mobilePhone !== this.mobilePhone

      }
    },
    methods: {
      updateMask() {
        if (this.country) {
          setTimeout(() => {
            this.mobilePhone = this.phoneMasks[this.country].replace(/#/g, '');
          }, 50)
        }
      },
      clearError() {
        this.errors = [];
        this.error = false
      },
      setValues() {
        this.contactId = this.contact.contactId;
        this.firstname = this.contact.firstname;
        this.lastname = this.contact.lastname;
        this.country = this.contact.country;
        this.address = this.contact.address;
        this.email = this.contact.email;
        this.mobilePhone = this.contact.mobilePhone;

        this.$refs.mobilePhone.focus();
        this.$refs.mobilePhone.blur();
      },
      close() {
        this.modal = false;
        this.clean();
        this.clearError();
        this.$emit('close')
      },
      clean() {
        this.$refs.form.reset();
        this.firstname = "";
        this.lastname = "";
        this.country = "";
        this.address = "";
        this.email = "";
        this.mobilePhone = ""
      },
      open() {
        this.modal = true
      },
      save() {
        if (this.$refs.form.validate()) {
          let form = new FormData();

          form.append('contactId', this.contactId);
          form.append('firstname', this.firstname);
          form.append('lastname', this.lastname);
          form.append('country', this.country);
          form.append('address', this.address);
          form.append('email', this.email);
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
            })
            .catch((err) => {
              this.clearError();
              this.error = true;
              this.loading = false;
              this.errors = err.body.message.split(';').slice(0, -1);
          })
        }
      }
    },
    watch: {
      contact(v) {
        if (Object.keys(v).length) {
          this.open();
          this.setValues();
        }
      }
    }
  }

</script>

<style scoped>

</style>

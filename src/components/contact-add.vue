<template>
  <v-dialog v-model="modal" persistent scrollable max-width="450px">

    <v-btn slot="activator" flat color="blue" dark>new contact</v-btn>

    <v-card>
      <v-card-title>
        <span class="headline">Contact data</span>
      </v-card-title>

      <v-divider/>

      <v-card-text style="max-height: 400px">
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12>
              <v-text-field
                label="First name"
                v-model="firstname"
              />
            </v-flex>

            <v-flex xs12>
              <v-text-field
                label="Last name"
                v-model="lastname"
              />
            </v-flex>

            <v-flex xs12>
              <v-text-field
                label="Middle name"
                v-model="middlename"
              />
            </v-flex>

            <v-flex xs12>
              <v-text-field
                label="Mobile phone"
                v-model="mobilePhone"
              />
            </v-flex>

            <v-flex xs12>
              <v-text-field
                label="Home phone"
                v-model="homePhone"
              />
            </v-flex>

            <v-flex xs12>
              <v-text-field
                label="Address"
                v-model="address"
              />
            </v-flex>

            <v-flex xs12>
              <v-text-field
                label="Email"
                v-model="email"
              />
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>

      <v-divider/>

      <v-card-actions>
        <v-spacer/>
        <v-btn color="blue darken-1" flat @click.native="modal = false">Close</v-btn>
        <v-btn color="blue darken-1" flat @click.native="save">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  const api_url = 'https://vuejs-phone-book.herokuapp.com/';
  import tokenService from '@/services/token'

  export default {
    data: () => ({
      modal: false,
      firstname: null,
      middlename: null,
      lastname: null,
      address: null,
      email: null,
      homePhone: null,
      mobilePhone: null,
    }),
    methods: {
      close() {
        this.modal = false
      },
      clean() {
        this.firstname = null;
        this.lastname = null;
        this.middlename = null;
        this.address = null;
        this.email = null;
        this.homePhone = null;
        this.mobilePhone = null
      },
      open() {
        this.modal = true
      },
      save() {
        let form = new FormData();

        form.append('firstname', this.firstname);
        form.append('lastname', this.lastname);
        form.append('middlename', this.middlename);
        form.append('address', this.address);
        form.append('email', this.email);
        form.append('homePhone', this.homePhone);
        form.append('mobilePhone', this.mobilePhone);

        this.$http.post(api_url + 'contacts/add', form,
          {
            headers: {
              'Authorization': tokenService.getAuthHeader()
            }
          })
          .then(() => {
            this.close();
            this.$emit('update');
            this.clean();
            console.log('Contact has been added')
          })
      }
    }
  }
</script>

<style scoped>

</style>

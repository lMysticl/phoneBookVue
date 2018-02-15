<template>
  <v-container fluid>
    <v-layout justify-center>
      <v-flex style="max-width: 1250px" class="pt-5">
        <v-card>
          <v-card-actions>
            <contact-add @update="loadContactList"/>
            <v-btn v-if="selected.length" @click="deleteSelectedContacts">Delete selected</v-btn>

            <v-spacer/>

            <v-text-field box label="Search" v-model="search"/>
          </v-card-actions>
          <v-data-table
            :loading = 'loading'
            :headers="headers"
            :items="contacts"
            :search="search"
            select-all
            v-model="selected"
            item-key="contactId"
            :pagination.sync="pagination"
          >
            <template slot="items" slot-scope="props">
              <tr>
                <td>
                  <v-checkbox
                    primary
                    hide-details
                    v-model="props.selected"
                  />
                </td>
                <td class="text-xs-right">{{ props.item.contactId }}</td>
                <td class="text-xs-right">{{ props.item.firstname }}</td>
                <td class="text-xs-right">{{ props.item.lastname }}</td>
                <td class="text-xs-right">{{ props.item.middlename }}</td>
                <td class="text-xs-right">{{ props.item.mobilePhone }}</td>
                <td class="text-xs-right">{{ props.item.homePhone }}</td>
                <td class="text-xs-right">{{ props.item.address }}</td>
                <td class="text-xs-right">{{ props.item.email }}</td>
                <td class="justify-center layout px-0">
                  <v-btn icon class="mx-0" @click="selectContact(props.item.contactId)">
                    <v-icon color="teal">edit</v-icon>
                  </v-btn>
                  <v-btn icon class="mx-0" @click="deleteContact(props.item.contactId)">
                    <v-icon color="pink">delete</v-icon>
                  </v-btn>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-card>

        <contact-edit @update="loadContactList" :contact='contact'/>
      </v-flex>
    </v-layout>
  </v-container>

</template>


<script>
    const api_url = 'http://localhost:8080/';

    import tokenService from '@/services/token'
    import contactEdit from '@/components/contact-edit'
    import contactAdd from '@/components/contact-add'

    export default {
      components: {
        contactEdit,
        contactAdd
      },
      data () {
        return {
          contact: {},
          loading: false,
          selected: [],
          search: null,
          pagination: {
            rowsPerPage: 10
          },
          headers: [
            { text: 'ID', align: 'left', value: 'contactId' },
            { text: 'First Name', value: 'firstname' },
            { text: 'Last Name', value: 'lastname' },
            { text: 'Middle Name', value: 'middlename' },
            { text: 'Mobile Name', value: 'mobilePhone' },
            { text: 'Home phone', value: 'homePhone' },
            { text: 'Address', value: 'address' },
            { text: 'Email', value: 'email' },
            { text: 'Actions', value: 'name', sortable: false }
          ],
          contacts: []
        }
      },
      created () {
        this.loadContactList ()
      },
      methods: {
        loadContactList () {
          this.loading = true;

          this.$http.get(api_url + 'contacts/get-all', {
            headers: {
              'Authorization': tokenService.getAuthHeader()
            }
          })
            .then(response => {
                this.contacts = response.body;
                this.loading = false
            })
        },
        selectContact (id) {
          this.contact = this.contacts.find(el => (el.contactId === id))
        },
        deleteContact (id) {
          let form = new FormData();

          form.append('contactId', id);

          this.$http.post(api_url + 'contacts/delete', form,
            {
              headers: {
                'Authorization': tokenService.getAuthHeader()
              }
            })
            .then(() => {
              // console.log('Contact -> ' + ids + ' has been deleted');
              this.selected = [];
              this.loadContactList ()
            })
        },
        deleteSelectedContacts () {
          let form = new FormData();

          let ids = this.selected.map(el => {
            return el.contactId
          });

          form.append('contactId',  ids);


          console.log(form.getAll('contactId'));

          this.$http.post(api_url + 'contacts/deleteList', form,
            {
              headers: {
                'Authorization': tokenService.getAuthHeader()
              }
            })
            .then(() => {
              // console.log('Contact -> ' + ids + ' has been deleted');
              this.selected = [];
              this.loadContactList ()
            })
        }
      },
      computed: {
        pages () {
          if (this.pagination.rowsPerPage == null ||
            this.pagination.totalItems == null
          ) return 0;

          return Math.ceil(this.contacts.length / this.pagination.rowsPerPage)
        }
      }
    }
</script>

<style>
  .select {
    cursor: pointer;
  }
</style>

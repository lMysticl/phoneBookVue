<template>
  <v-container fluid>
    <v-layout justify-center>
      <v-flex style="max-width: 1250px" class="pt-5">
        <v-card>
          <v-container fluid grid-list-md>
            <v-layout row wrap align-center>
              <v-flex xs12 md6>
                <v-text-field append-icon="search" box label="Search" v-model="search"/>
              </v-flex>

              <v-flex xs12 md6>
                <contact-add @update="loadContactList"/>

                <v-btn v-if="selected.length" :loading="deleting" color="red" dark @click="deleteSelectedContacts">
                  Delete selected ({{ selected.length }})
                </v-btn>
              </v-flex>
            </v-layout>
          </v-container>

          <v-divider/>

          <div v-if="!isMobile">
           <v-data-table
             :loading='loading'
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
                 <td class="text-xs-right">{{ props.item.contactId || '-' }}</td>
                 <td class="text-xs-right">{{ props.item.firstname || '-' }}</td>
                 <td class="text-xs-right">{{ props.item.lastname || '-' }}</td>
                 <td class="text-xs-right">{{ props.item.country || '-' }}</td>
                 <td class="text-xs-right">{{ props.item.mobilePhone || '-' }}</td>
                 <td class="text-xs-right">{{ props.item.address || '-' }}</td>
                 <td class="text-xs-right">{{ props.item.email || '-' }}</td>
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
         </div>

          <div v-if="isMobile">
           <v-container fluid grid-list-lg>
             <v-layout row wrap>
               <v-flex xs12 sm6 md6>
                 <v-select
                   label="Sort by"
                   :items="sortList"
                   v-model="sortBy"
                   autocomplete
                   prepend-icon="sort_by_alpha"
                 />
               </v-flex>

               <v-flex xs12 sm6 md6>
                 <v-select
                   label="Sort direction"
                   :items="['ascending', 'descending']"
                   v-model="sortDirection"
                   prepend-icon="swap_vert"
                 />
               </v-flex>
             </v-layout>

             <v-data-iterator
               v-if="!loading"
               content-tag="v-layout"
               row
               wrap
               :search="search"
               :items="contacts"
               :rows-per-page-items="rowsPerPageItems"
               :pagination.sync="pagination"
             >
               <v-flex
                 slot="item"
                 slot-scope="props"
                 xs12
                 sm6
                 md3
                 lg3
               >
                 <v-card hover>
                   <v-list dense>
                     <v-list-tile>
                       <v-list-tile-content>First name:</v-list-tile-content>
                       <v-list-tile-content class="align-end">{{ props.item.firstname || '-' }}</v-list-tile-content>
                     </v-list-tile>

                     <v-list-tile>
                       <v-list-tile-content>Mobile phone:</v-list-tile-content>
                       <v-list-tile-content class="align-end">{{ props.item.mobilePhone || '-' }}</v-list-tile-content>
                     </v-list-tile>

                     <expantion-panel>

                       <v-list-tile>
                         <v-list-tile-content>Last name:</v-list-tile-content>
                         <v-list-tile-content class="align-end">{{ props.item.lastname || '-' }}</v-list-tile-content>
                       </v-list-tile>

                       <v-list-tile>
                         <v-list-tile-content>Country:</v-list-tile-content>
                         <v-list-tile-content class="align-end">{{ props.item.country || '-' }}</v-list-tile-content>
                       </v-list-tile>

                       <v-list-tile>
                         <v-list-tile-content>Address:</v-list-tile-content>
                         <v-list-tile-content class="align-end">{{ props.item.address || '-' }}</v-list-tile-content>
                       </v-list-tile>

                       <v-list-tile>
                         <v-list-tile-content>Email:</v-list-tile-content>
                         <v-list-tile-content class="align-end">{{ props.item.email || '-' }}</v-list-tile-content>
                       </v-list-tile>

                       <v-list-tile>
                         <v-list-tile-content>Contact ID:</v-list-tile-content>
                         <v-list-tile-content class="align-end">{{ props.item.contactId || '-' }}</v-list-tile-content>
                       </v-list-tile>

                     </expantion-panel>
                   </v-list>

                   <v-divider/>

                   <v-card-actions align-center>
                     <v-checkbox @change="updateSelection" v-model="checkboxes[props.item.contactId]" hide-details/>

                     <v-spacer/>

                     <v-btn :disabled="deleting" icon class="mx-0" @click="selectContact(props.item.contactId)">
                       <v-icon color="teal">edit</v-icon>
                     </v-btn>

                     <v-btn :disabled="deleting" icon class="mx-0" @click="deleteContact(props.item.contactId)">
                       <v-icon color="pink">delete</v-icon>
                     </v-btn>
                   </v-card-actions>
                 </v-card>
               </v-flex>
             </v-data-iterator>

             <v-layout v-if="loading" align-center justify-center class="pa-2">
               <v-progress-circular :size="50" indeterminate color="primary"/>
             </v-layout>
           </v-container>
         </div>
        </v-card>

        <contact-edit @close="clearContact" @update="loadContactList" :contact='contact'/>
      </v-flex>
    </v-layout>
  </v-container>

</template>


<script>
  const api_url = 'https://vue-java-phone-book-v2.herokuapp.com/';

  import tokenService from '@/services/token'
  import contactEdit from '@/components/contact-edit'
  import contactAdd from '@/components/contact-add'
  import expantionPanel from '@/components/expantion-panel'


  export default {
    components: {
      contactEdit,
      contactAdd,
      expantionPanel
    },
    data() {
      return {
        contact: {},
        loading: false,
        deleting: false,
        selected: [],
        search: null,
        rowsPerPageItems: [5, 10, 15, {"text":"All","value":-1}],
        checkboxes: {},

        pagination: {
          rowsPerPage: 10
        },
        headers: [
          {text: 'ID', align: 'right', value: 'contactId'},
          {text: 'First Name', align: 'right', value: 'firstname'},
          {text: 'Last Name', align: 'right', value: 'lastname'},
          {text: 'Country', align: 'right', value: 'country'},
          {text: 'Mobile Phone', align: 'right', value: 'mobilePhone'},
          {text: 'Address', align: 'right', value: 'address'},
          {text: 'Email', align: 'right', value: 'email'},
          {text: 'Actions', align: 'right', sortable: false}
        ],
        contacts: []
      }
    },
    created() {
      this.loadContactList()
    },
    methods: {
      clearContact() {
        this.contact = {}
      },
      updateSelection() {
        this.selected = [];

        for (let k in this.checkboxes) {
          if (this.checkboxes[k]) {
            const contact = this.contacts.find(el => (el.contactId == k));
            this.selected.push(contact)
          }
        }
      },
      loadContactList() {
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
      selectContact(id) {
        this.contact = this.contacts.find(el => (el.contactId === id))
      },
      deleteContact(id) {
        let form = new FormData();

        form.append('contactId', id);

        this.$http.post(api_url + 'contacts/delete', form,
          {
            headers: {
              'Authorization': tokenService.getAuthHeader()
            }
          })
          .then(() => {

            this.selected = [];
            this.loadContactList()
          })
      },
      deleteSelectedContacts() {
        let form = new FormData();

        this.deleting = true;

        let ids = this.selected.map(el => {
          return el.contactId
        });

        console.log(ids);

        form.append('contactId', ids);

        this.$http.post(api_url + 'contacts/deleteList', form,
          {
            headers: {
              'Authorization': tokenService.getAuthHeader()
            }
          })
          .then(() => {
            this.selected = [];
            this.checkboxes = {};
            this.loadContactList();
            this.deleting = false;
          })
          .catch(err => {
            this.deleting = false;
          })
      }
    },

    computed: {
      sortList () {
        return this.headers.map(el => {
          if(el.text !== 'Action') return {text: el.text, value: el.value}
        })
      },
      sortBy: {
        get () {},
        set (v) {
          this.pagination.sortBy = v
        }
      },
      sortDirection: {
        get () {},
        set (v) {
          this.pagination.descending = v === 'descending';
        }
      },
      isMobile() {
        return this.$vuetify.breakpoint.mdAndDown
      },
      pages() {
        if (this.pagination.rowsPerPage == null ||
          this.pagination.totalItems == null
        ) return 0;

        return Math.ceil(this.contacts.length / this.pagination.rowsPerPage)
      }
    },

    watch: {
      isMobile(v) {
        this.selected = [];
        this.checkboxes = {};
      }
    }
  }
</script>

<style>
  .select {
    cursor: pointer;
  }
</style>

<template>
  <v-container fill-height>
    <v-layout justify-center align-center>
      <v-flex style="max-width: 1150px">
        <v-card>
          <v-card-title>
            <h1 class="display-2" dark>Welcome {{user.username ? user.username : 'User'}} to the Phone Book app</h1>
          </v-card-title>

         <v-card-text style="font-size: 16px;">
           <div class="mb-2">
             <b>Opportunities and functions:</b>
           </div>

           <ul class="pl-4">
             <li>Mobile view</li>
             <li>Authorization</li>
             <li>Registration</li>
             <li>Save update sort search contacts</li>
             <li>This page is fully adaptable, for different screen sizes</li>
           </ul>

           <div class="my-2">
             <b>For check real data you can use test user:</b>
           </div>

           <ul class="pl-4">
             <li><b>Login: test</b></li>
             <li><b>Password: 12345</b></li>
           </ul>
         </v-card-text>

          <v-divider/>

          <v-card-text>
            <div class="title mb-3">Check more on Github!</div>
            <v-btn large color="primary" href="https://github.com/lMysticl" target="_blank" class="mx-0">See more</v-btn>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    name: "welcome",
    computed: {
      user () {
        return this.$store.getters.user
      }
    }
  }
</script>

<style scoped>
  .child-flex > *, .flex {

    color: #000000;
    background: #ECEFF1;
    opacity: 0.82;
    filter: alpha(Opacity=20);
  }
</style>

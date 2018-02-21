<template>
  <v-container>
    <v-layout justify-center>
      <v-flex style="max-width: 1150px">
        <v-jumbotron
          height="500px"
        >
          <v-container fill-height>
            <v-layout align-center>
              <v-flex>
                <h3 class="display-3" dark>Welcome to the Phone Book app</h3>
                <span class="subheading"><p>
                   <br>
                 <b>Opportunities and functions.</b>
                    <br>
                  - Authorization
                   <br>
                 - Registration
                   <br>
                 - Save update sort search contacts.
                   <br>
                 - And this page is fully adaptable, for different screen sizes.
</p></span>
                <v-divider class="my-3"/>
                <div class="title mb-3">Check more on Github!</div>
                <v-btn large color="primary" href="https://github.com/lMysticl" target="_blank" class="mx-0">See more
                </v-btn>
              </v-flex>
            </v-layout>
          </v-container>
        </v-jumbotron>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    name: "welcome"
  }
</script>

<style scoped>

</style>

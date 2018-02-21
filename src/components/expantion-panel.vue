<template>

  <div>
    <slot v-if="show"></slot>
    <div>
      <v-btn block color="grey darken-2" @click="show = !show">{{ show? 'hide': 'show' }}</v-btn>
    </div>
  </div>
</template>

<script>
  export default {
    data: () => ({
      show: false
    })
  }
</script>

<style scoped>

</style>

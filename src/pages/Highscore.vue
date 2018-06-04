<template>
  <v-ons-page>

    <custom-toolbar v-bind="toolbarInfo"></custom-toolbar>

    <div class="header">
      <div class="flex-container">
        <div class="card">
          <div class="container">
            <b>{{ highscore }}</b>
          </div>
        </div>
      </div>
    </div>
  </v-ons-page>
</template>

<script>
  export default {
    data() {
      return {
        highscore: this.$store.state.highscore.score
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .header {
    text-align: center;
  }
</style>

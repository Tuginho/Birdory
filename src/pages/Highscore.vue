<template>
  <v-ons-page>

    <custom-toolbar v-bind="toolbarInfo"></custom-toolbar>

    <div class="header">
      <div class="flex-container">
        <div class="card">
            <p>{{ highscore }}</p>
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

  .card {
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
    transition: 0.3s;
    border-radius: 5px;
    max-height: 250px;
    max-width: 250px;
    font-size: 4vw;
    display: inline-block;
  }
</style>

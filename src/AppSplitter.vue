<template>
  <v-ons-page>
    <v-ons-splitter>
      <v-ons-splitter-content>
        <home></home>
      </v-ons-splitter-content>
    </v-ons-splitter>
  </v-ons-page>
</template>

<script>
  import Home from './pages/Home.vue'
  import AppTabbar from './AppTabbar.vue';

  export default {
    computed: {
      isOpen: {
        get() {
          return this.$store.state.splitter.open;
        },
        set(newValue) {
          this.$store.commit('splitter/toggle', newValue)
        }
      }
    },
    components: { Home }
  };
</script>

<style>
  ons-splitter-side[animation=overlay] {
    border-left: 1px solid #bbb;
  }
</style>

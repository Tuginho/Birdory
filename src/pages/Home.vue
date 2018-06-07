<template>
  <v-ons-page>
    <div style="text-align: center">
      <p id="welcome">Welcome to Birdory!</p>
    </div>

    <div class="flex-container">
        <div class="card" v-for="page of pages" :key="page.label" @click="push(page.component, page.label)">
          <div class="container">
            {{ page.title }}
          </div>
        </div>
    </div>
  </v-ons-page>
</template>

<script>
  import Play from './Play.vue';
  import Highscore from './Highscore.vue'

  export default {
    data () {
      return {
        pages: [
          {
            component: Play,
            label: 'Game',
            title: 'Start Game'
          },
          {
            component: Highscore,
            label: 'Highscore',
            title: 'Highscore'
          }
        ]
      };
    },
    methods: {
      push(page, key) {
        this.$store.commit('navigator/push', {
          extends: page,
          data() {
            return {
              toolbarInfo: {
                backLabel: 'Home',
                title: key
              }
            }
          }
        });
      }
    }
  };
</script>

<style>
  .intro {
    text-align: left;
    padding: 0 22px;
    margin-top: 20px;
    font-size: 14px;
    line-height: 1.4;
    color: rgba(0, 0, 0, .54);
  }

  .card {
    position: center;
    text-align: center;
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
    transition: 0.3s;
    width: 40%;
    min-height: 150px;
    border-radius: 50px;
  }

  .card:hover {
    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
  }

  #welcome {
    font-size: 4vw;
  }

  .flex-container {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .container {
    line-height: normal;
    display: inline-block;
    vertical-align: middle;
    font-size: 4vw;
  }

</style>

<template>
  <v-ons-page>

    <custom-toolbar v-bind="toolbarInfo"></custom-toolbar>


    <div class="header">
      <audio autoplay="true" :src="rightBird.voice_url" controls></audio>

      <div class="flex-container">
        <div class="card" v-for="bird of birds" :key="bird.name" @click="checkAnswer(bird)">
          <img v-bind:src="bird.image_url" alt="Bird">
          <div class="container">
            <b>{{ bird.name }}</b>
          </div>
        </div>
      </div>
    </div>

    <div class="flex-container">
      <v-ons-button style="margin: 6px; width: 350px; text-align: center; background-color: green" >Score: {{ roundScore }}</v-ons-button>
      <v-ons-button modifier="cta" style="margin: 6px; width: 350px; text-align: center; background-color: darkred" >False: {{ falseRoundScore }}</v-ons-button>
      <v-ons-button modifier="cta" style="margin: 6px; width: 350px; text-align: center" @click="nextBirds()" >Next Birds</v-ons-button>
    </div>
  </v-ons-page>
</template>

<script>
  import BirdDataService from '../services/BirdDataService';

  let birdDataService = new BirdDataService();

  export default {
    name: 'play',
    data () {
      return {
        msg: 'Birdory',
        birds: [],
        rightBird: [],
        roundScore: 0,
        falseRoundScore: 0,
        correctAnswer: true,
        loading: true,
        sound: null,
        essentialLinks: [
          {
            label: 'Core Docs',
            link: 'https://vuejs.org',
            icon: 'fa-book'
          }
        ]
      }
    },
    mounted () {
      birdDataService.getRandomBirds(4).then(response => {
        this.birds = response;
        this.loading = false;
      }).finally( () => {
        this.playBirdSound();
        this.shuffle();
      })
    },
    methods: {
      goTo (url) {
        const newWindow = window.open(url, '_blank')
        newWindow.opener = null
        newWindow.location = url
      },
      playBirdSound: function () {
        this.sound = new Howl({
          src: [this.rightBird.voice_url],
          autoplay: true,
          volume: 0.5,
          onend: function () {
            console.log('Finished!');
          }
        });
        this.sound.play();
      },
      shuffle: function () {
        this.rightBird = this.birds[this.getRandomInt(4)]
      },
      nextBirds: function () {
        // Load four new birds
        birdDataService.getRandomBirds(4).then(response => {
          this.birds = response;
          this.loading = false;
        }).finally( () => {
          this.shuffle();
        })
      },
      checkAnswer: function (bird) {
        if (bird.name === this.rightBird.name) {
          console.log('Right!');

          // Update Scoring
          this.roundScore = this.roundScore + 1;
          this.$store.commit('highscore/updateScore', 1);

          this.sound.stop();

          // Load new Birds
          this.nextBirds();

        } else {
          this.showTip('Wrong bird :(');

          this.falseRoundScore = this.falseRoundScore + 1;
          this.$store.commit('highscore/updateFalse', 1);
        }
      },
      getRandomInt: function (max) {
        return Math.floor(Math.random() * Math.floor(max))
      },
      showTip(message) {
          this.$ons.notification.toast({
            message,
            buttonLabel: 'Close',
            timeout: 2000
          })
      }
    }
  }
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
  }

  .card:active {
    background-color: lightskyblue;
  }

  .card:hover {
    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
  }

  img {
    border-radius: 5px 5px 0 0;
    width: 100%;
    max-width: 200px;
    max-height: 150px;
  }

  .container {
    text-align: center;
    padding: 2px 8px;
  }

  .flex-container {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;
  }


</style>

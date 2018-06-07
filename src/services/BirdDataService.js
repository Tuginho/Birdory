import axios from 'axios';

let birds = [];

let europeanaUrl = "https://www.europeana.eu/api/v2/search.json?wskey=" + process.env.EUROPEANA_API_KEY + "&query=Tierstimmenarchiv&reusability=open&profile=minimal";
let dbPediaUrl = "https://dbpedia.org/sparql?default-graph-uri=http://dbpedia.org";

export default class BirdDataService {

  getRandomBirds(count = 4) {
    return this.fetchBirds().then(function (birds) {
      if (birds.length < count) {
        return birds;
      }
      let randomBirds = [];
      let indexes = [];
      let currentIndex = 0;
      for (let i = 0; i < count; i++) {
        do {
          currentIndex = Math.floor((Math.random() * birds.length));
        } while (indexes.includes(currentIndex));
        indexes.push(currentIndex);
        randomBirds.push(birds[currentIndex]);
      }
      return randomBirds;
    });
  }

  fetchBirds() {
    if (localStorage.getItem('birds')) {
      return new Promise((resolve) => {resolve(JSON.parse(localStorage.getItem('birds')))});
    }

    return this.fetchBirdVoices().then(function (rawBirds) {
      let dbPediaCalls = [];
      let foundBirds = [];
      let binomials = "";
      birds.forEach(function (bird, index) {
        // Prevent birds being added more than once
        if (!foundBirds.includes(bird.binomial)) {
          foundBirds.push(bird.binomial);
          // this has to be split in multiple requests, otherwise the request uri is too long
          if (index % 50 !== 0) {
            binomials += "'" + bird.binomial + "' or "
          } else {
            binomials += "'" + bird.binomial + "'";
            let sparqlQuery = "SELECT ?name ?image ?bird ?binomial WHERE {\n" +
              "                   ?bird a dbo:Bird .\n" +
              "                   ?bird dbp:binomial ?binomial .\n" +
              "                   ?binomial bif:contains \"" + binomials + "\" .\n" +
              "                   ?bird dbo:thumbnail ?image .\n" +
              "                   ?bird rdfs:label ?name .\n" +
              "                   FILTER (LANG(?name) = 'de' || LANG(?name) = 'en') .\n" +
              "              }";
            dbPediaCalls.push(axios.get(dbPediaUrl + "&query=" + sparqlQuery + "&format=application%2Fsparql-results%2Bjson"));
            binomials = "";
          }
        }
      });


      let resultBirds = [];
      return axios.all(dbPediaCalls).then(function (dbPediaResponses) {
        dbPediaResponses.forEach(function (dbPediaResponse) {
          let foundBirds = [];
          if (dbPediaResponse.data.results.bindings[0]) {
            birds.forEach(function (rawBird) {
              if (!foundBirds.includes(rawBird.binomial)) {
                foundBirds.push(rawBird.binomial);
                if (rawBird.binomial === dbPediaResponse.data.results.bindings[0].binomial.value) {
                  rawBird.name = dbPediaResponse.data.results.bindings[0].name.value;
                  rawBird.image_url = dbPediaResponse.data.results.bindings[0].image.value.replace("http://", "https://");
                  resultBirds.push(rawBird);
                }
              }
            });
          }
        });
        localStorage.setItem('birds', JSON.stringify(resultBirds));
        return resultBirds;
      });
    });
  }

  fetchBirdVoices(nextCursor) {
    if (nextCursor === undefined) {
      nextCursor = '*'
    }
    return axios
      .get(europeanaUrl + "&cursor=" + nextCursor + "&rows=100")
      .then( function (response) {
        response.data.items.forEach(function (item, index) {
          let titleParts = item.title[0].split(" ");
          let title = titleParts[0] + " " + titleParts[1];
          birds.push({
            voice_url: BirdDataService.extractVoiceUrl(item.edmPreview[0]),
            id: item.id,
            binomial: title
          });
        });

        if (response.data.nextCursor !== undefined) {
          let birdDataService = new BirdDataService();
          return birdDataService.fetchBirdVoices(response.data.nextCursor);
        } else {
          return(birds)
        }
      });
  }

  static extractVoiceUrl(edmPreview) {
    return decodeURIComponent(edmPreview.substring(edmPreview.lastIndexOf("?uri=") + 5, edmPreview.lastIndexOf(".mp3&") + 4));
  }
}

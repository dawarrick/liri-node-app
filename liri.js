//get the environment variable
require("dotenv").config();
//const inquirer = require('inquirer')
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var axios = require("axios");
var moment = require("moment");


var spotify = new Spotify(keys.spotify);

//'All the Small Things' 
//Spotify
if (1 === 2) {
    spotify.search({ type: 'track', query: 'The Hills are Alive' }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        // console.log(data);  can be multiple of all.
        console.log("Song Name: " + JSON.stringify(data.tracks.items[0].name))
        console.log("Artist(s): " + JSON.stringify(data.tracks.items[0].album.artists[0].name))   //multiple
        console.log("Preview Link: " + JSON.stringify(data.tracks.items[0].preview_url))
        console.log("Album: " + JSON.stringify(data.tracks.items[0].album.name))
    });
}
//Bandsintown

/*Name of the venue
Venue location
Date of the Event (use moment to format this as "MM/DD/YYYY")
*/


// Run the axios.get function...
// The axios.get function takes in a URL and returns a promise (just like $.ajax)
if (1 === 2) {
    var artist = "Madonna";
    axios.get(`https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp?date=upcoming`)
        .then(function (response) {
            // If the axios was successful...
            // Then log the body from the site!
            console.log(response.data);
            console.log("Name of Venue: " + JSON.stringify(data[0].venue.name))
            console.log("Location: " + JSON.stringify(data[0].venue.city + ", " + data[0].venue.region))
            console.log("Date of Event (MM/DD/YYYY): " + JSON.stringify(data[0].datetime))

        })
        .catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an object that comes back with details pertaining to the error that occurred.
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log("Error", error.message);
            }
            console.log(error.config);
        });
}
/* movie this
    * Title of the movie.
    * Year the movie came out.
    * IMDB Rating of the movie.
    * Rotten Tomatoes Rating of the movie.
    * Country where the movie was produced.
    * Language of the movie.
    * Plot of the movie.
    * Actors in the movie.
*/
var artist = "Madonna";

axios.get("http://www.omdbapi.com/?t=remember+the+titans&y=&plot=short&apikey=trilogy").then(
    function (response) {
        console.log(JSON.stringify(response.data));
        console.log("Title: " + JSON.stringify(response.data.Title))
        console.log("Year: " + JSON.stringify(response.data.Year))
        console.log("The movie's rating is: " + response.data.imdbRating);
        var i = response.data.Ratings.findIndex(i => i.Source === "Rotten Tomatoes")
        console.log(i)
        console.log("Rotten Tomatoes: " + response.data.Ratings[i].Value);
        console.log("Country: " + response.data.Country);
        console.log("Language: " + response.data.Language);
        console.log("Plot: " + response.data.Plot);
        console.log("Actors: " + response.data.Actors);
    }
);

//var found = arr.filter(function(item) { return item.name === 'k1'; });
//Source":"Rotten Tomatoes","Value":"73%"

/*axios.get(`http://www.omdbapi.com/?t=remember+the+titans&y=&plot=short&apikey=trilogy`)
    .then(function (response) {
        // If the axios was successful...
        // Then log the body from the site!
        console.log(response.data);
        console.log("Name of Venue: " + JSON.stringify(data[0].venue.name))
        console.log("Location: " + JSON.stringify(data[0].venue.city + ", " + data[0].venue.region))
        console.log("Date of Event (MM/DD/YYYY): " + JSON.stringify(data[0].datetime))

    })
    .catch(function (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an object that comes back with details pertaining to the error that occurred.
            console.log(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log("Error", error.message);
        }
        console.log(error.config);
    });
*/



//https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp?date=upcoming


/*This will search the Bands in Town Artist Events API (`"https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"`)

//* You should then be able to access your keys information like so
//pull in the spotify keys

  var spotify = new Spotify(keys.spotify);


9. Make it so liri.js can take in one of the following commands:

/*(bandsintown)
node liri.js concert-this <artist/band name here>

(spotify)
`node liri.js spotify-this-song '<song name here>'`
   * `spotify-this-song`
(ODBM) `node liri.js movie-this '<movie name here>'`
   * `movie-this`

   * `do-what-it-says`
   /*Hey everyone I found this nice bit of code that allows you to use the readline module that comes default with
   node The readline allows you to prompt the user for an input. This snippet in particular solves the tamagotchi
   problem and prevents the file itself from closing, so you can keep inputting commands without having the values reset.*/
/*   const readline = require('readline');
   const rl = readline.createInterface({
       input: process.stdin,
       output: process.stdout
   });
   var repeat = function () {
       rl.question('Input an action... ', (input) => {
           input = input.split(" ");
           animals[input[0]][input[1]]();
           repeat();
       });
   }
   repeat();*/
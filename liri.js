//get the environment variable
require("dotenv").config();

//load up the includes
const inquirer = require('inquirer')
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var axios = require("axios");
var moment = require("moment");

//store the spotify keys in the spotify object
var spotify = new Spotify(keys.spotify);
var results = [];

//Spotify if spotify-this-song is passed.
//'The Sign' will be the default if spotify called with no song 

var song = "yellow submarine";
var i = 0;

if (1 === 1) {
    results = [];
    spotify.search({ type: 'track', query: song, limit: 1 })
        .then(function (response) {
            response.tracks.items.forEach(function (ea) {
                results.push({
                    artist: ea.artists,
                    song: ea.name,
                    preview: ea.preview_url,
                    album: ea.album.name
                });
            })
            printSpotify();         //send to the console and add to log file
        })
        .catch(function (err) {
            console.log(err);
        });
}

//concert-this will call Bandsintown.  It will default to Madonna if no value is passed.

if (1 === 2) {
    results = [];
    var artist = "Madonna";
    axios.get(`https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp?date=upcoming`)
        .then(function (response) {
            response.data.forEach(function (ea) {
                results.push({
                    venue: ea.venue.name,
                    location: ea.venue.city + ', ' + ea.venue.region,
                    date: convertDate(ea.datetime.substr(0, 10), 'YYYY-MM-DD', 'MM/DD/YYYY')
                });
            })
            printBand();         //send to the console and add to log file
            // If the axios was successful...
            // Then log the body from the site!
            //console.log(response.data);
            /*           console.log("Name of Venue: " + JSON.stringify(response.data[0].venue.name));
                       console.log("Location: " + JSON.stringify(response.data[0].venue.city + ", " + response.data[0].venue.region));
                       console.log("Date of Event (MM/DD/YYYY): " + JSON.stringify(response.data[0].datetime));
                       //console.log("substr "+JSON.stringify(response.data[0].datetime.substr(0,10)))
                       var returnDate = convertDate(JSON.stringify(response.data[0].datetime.substr(0, 10)), 'YYYY-MM-DD','MM/DD/YYYY');*/
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
/* movie-this will pull from the OMDB database
    if no movie is passed, it will display for the movie 'Mr. Nobody'
*/
var movie = "Mr. Nobody";
if (1 === 2) {
    results = [];
    axios.get(`http://www.omdbapi.com/?t=${movie}&y=&plot=short&apikey=trilogy`).then(
        function (response) {
            //console.log(JSON.stringify(response.data));
            /*            console.log("Title: " + JSON.stringify(response.data.Title))
                        console.log("Year: " + JSON.stringify(response.data.Year))
                        console.log("The movie's rating is: " + response.data.imdbRating);
                        var i = response.data.Ratings.findIndex(i => i.Source === "Rotten Tomatoes")
                        console.log(i)
                        console.log("Rotten Tomatoes: " + response.data.Ratings[i].Value);
                        console.log("Country: " + response.data.Country);
                        console.log("Language: " + response.data.Language);
                        console.log("Plot: " + response.data.Plot);
                        console.log("Actors: " + response.data.Actors);*/
            //load into a results array
            response.data.forEach(function (ea) {
                results.push({
                    title: ea.Title,
                    year: ea.year,
                    imdbRating: ea.imdbRating,
                    rottenRating: ea.Ratings[response.data.Ratings.findIndex(i => i.Source === "Rotten Tomatoes")].Value,
                    country: ea.Country,
                    language: ea.language,
                    plot: ea.Plot,
                    actors: ea.Actors
                });
            })
            printMovie();         //send to the console and add to log file

            /*          console.log("Title: " + JSON.stringify(response.data.Title))
                      console.log("Year: " + JSON.stringify(response.data.Year))
                      console.log("The movie's rating is: " + response.data.imdbRating);
                      var i = response.data.Ratings.findIndex(i => i.Source === "Rotten Tomatoes")
                      console.log(i)
                      console.log("Rotten Tomatoes: " + response.data.Ratings[i].Value);
                      console.log("Country: " + response.data.Country);
                      console.log("Language: " + response.data.Language);
                      console.log("Plot: " + response.data.Plot);
                      console.log("Actors: " + response.data.Actors)*/
        }
    );
}


function printSpotify() {
    for (var i = 0; i < results.length; i++) {
        //need to loop through the artists because there can be multiple
        var artists = "";
        for (var j = 0; j < results[i].artist.length; j++) {
            if (artists === "") {
                artists = results[i].artist[j].name;
            }
            else {
                artists = artists + ',' + results[i].artist[j].name;
            }
        }
        var previewURL = "";
        if (results[i].preview === null) {
            previewURL = 'N/A';
        } else {
            previewURL = results[i].preview;
        }
        console.log("Song Name: " + results[i].song)
        console.log("Artist(s): " + artists)   //multiple
        console.log("Preview Link: " + previewURL)
        console.log("Album: " + results[i].album)

    }
}

function printBand() {
    for (var i = 0; i < results.length; i++) {
        //need to loop through the artists because there can be multiple
 
        console.log("Venue: " + results[i].venue)
        console.log("Location: " + results[i].location)
        console.log("Date: " + results[i].date)
    }
}


function printMovie() {
    for (var i = 0; i < results.length; i++) {
        //need to loop through the artists because there can be multiple
 
        console.log("Title: " + results[i].title)
        console.log("Year: " + results[i].year)
        console.log("IMDB Rating: " + results[i].imdbrating)
        console.log("Rotten Tomatoes: " + results[i].rottenRating)
        console.log("Country: " + results[i].country)
        console.log("Language: " + results[i].language)
        console.log("Plot: " + results[i].plot)
        console.log("Actors: " + results[i].actors)
    }
}

/*function writeToFile(writeData) {
    // Append showData and the divider to log.txt, print showData to the console
    fs.appendFile("log.txt", writeData + divider, function (err) {
        if (err) throw err;
        console.log(showData);
    });
}*/


//this will convert a date from the format it is currently in to the desired return format
function convertDate(dateIn, dateFormatIn, dateFormatOut) {
    return convertedDate = moment(dateIn, dateFormatIn).format(dateFormatOut);
};

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
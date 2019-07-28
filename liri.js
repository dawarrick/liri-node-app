//get the environment variable
require("dotenv").config();

//load up the includes
const inquirer = require('inquirer');
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");

//store the spotify keys in the spotify object
var spotify = new Spotify(keys.spotify);
var results = [];
var command = "";

//get command line parameters
//this should be the action the user wants to perform
if (process.argv[2] !== undefined) {
    command = process.argv[2].toLowerCase();
}

//this is the lookup value
var searchCriteria = process.argv.splice(3).join(" ");

var divider = "*--------------------------------------------------------------------------------------------------------*"


//make sure they entered a valid command.  If not, let's prompt them to select from a list
function spotifyCall() {
    //Spotify if spotify-this-song is passed.

    console.log("spotify")
    //'The Sign' will be the default if spotify called with no song 
    if (searchCriteria === "") {
        searchCriteria = "The Sign";
    }
    results = [];
    spotify.search({ type: 'track', query: searchCriteria, limit: 1 })
        .then(function (response) {
            //console.log(response.tracks)
            //console.log(response.tracks.album)
            response.tracks.items.forEach(function (ea) {
                results.push({
                    artist: ea.artists,
                    song: ea.name,
                    preview: ea.preview_url,
                    album: ea.album.name
                });
            })
            if (results.length < 0) {
                noResults()
            }
            else {
            printSpotify();         //send to the console
            writeToRandom();        //add to text file of commands
            }
        })
        .catch(function (err) {
            console.log(err);
        });
}


//concert-this will call Bandsintown.  It will default to "Maroon 5" if no value is passed.

function concert() {

    results = [];
    //if nothing passed in going to default to Madonna
    if (searchCriteria === "") {
        searchCriteria = "Maroon 5";
    }
    axios.get(`https://rest.bandsintown.com/artists/${searchCriteria}/events?app_id=codingbootcamp?date=upcoming`)
        .then(function (response) {
            //console.log(response.data);
            response.data.forEach(function (ea) {

                results.push({
                    venue: ea.venue.name,
                    location: ea.venue.city + ', ' + ea.venue.region,
                    date: convertDate(ea.datetime.substr(0, 10), 'YYYY-MM-DD', 'MM/DD/YYYY')
                });
            })

            if (results.length < 0) {
                noResults()
            }
            else {
                printConcert();         //send to the console
                writeToRandom();        //add to text file of commands
            }
        })
        .catch(function (error) {
            console.log(error);
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

function movie() {

    results = [];
    //if nothing passed in going to default to Madonna
    if (searchCriteria === "") {
        searchCriteria = "Mr. Nobody";
    }

    axios.get(`http://www.omdbapi.com/?t=${searchCriteria}&y=&plot=short&apikey=trilogy`).then(
        function (response) {
            //console.log(JSON.stringify(response.data));

            results.push({
                title: response.data.Title,
                year: response.data.year,
                imdbRating: response.data.imdbRating,
                rottenRating: response.data.Ratings[response.data.Ratings.findIndex(i => i.Source === "Rotten Tomatoes")].Value,
                country: response.data.Country,
                language: response.data.language,
                plot: response.data.Plot,
                actors: response.data.Actors
            });
            if (results.length < 0) {
                noResults()
            }
            else {
                printMovie();         //send to the console
                writeToRandom();      //add to text file of commands
            }
        }
    );
}

//if the user want the program to select, will select a randomly from random.txt and call the process in the table
function doRandom() {
    //console.log("Doing Random")
    // load an array of the values from random.txt
    // The code will store the contents of the reading inside the variable "data"
    fs.readFile("random.txt", "utf8", function (error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }

        //get rid of the line feeds and put into an array
        var regex = /\r\n/;
        newData = data.replace(regex, ',').split(",");

        //each entry is in the array not each pair, so need to get an even number back to make sure we get the command first
        i = getIndex(newData.length / 2);
        command = newData[i];
        regex = /"/;
        searchCriteria = newData[i + 1];  //.replace(regex, '');

        processInput()
    });

}

//function will return the array value for a random command
function getIndex(arrayLength) {
    return Math.floor(Math.random() * (arrayLength - 1)) * 2;  //need to multiply by 2 to get an even index
}

function printSpotify() {
    for (var i = 0; i < results.length; i++) {
        //need to loop through the artists because there can be multiple
        var artists = "";
        console.log(divider)
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
        console.log(divider)
    }
    if (results.length < 0) {
        noResults()
    }
}

function printConcert() {

    for (var i = 0; i < results.length; i++) {
        //need to loop through the artists because there can be multiple
        console.log(divider)
        console.log("Venue: " + results[i].venue)
        console.log("Location: " + results[i].location)
        console.log("Date: " + results[i].date)
        console.log(divider)
    }


}


function printMovie() {
    for (var i = 0; i < results.length; i++) {
        //need to loop through the artists because there can be multiple
        console.log(divider)
        console.log("Title: " + results[i].title)
        console.log("Year: " + results[i].year)
        console.log("IMDB Rating: " + results[i].imdbrating)
        console.log("Rotten Tomatoes: " + results[i].rottenRating)
        console.log("Country: " + results[i].country)
        console.log("Language: " + results[i].language)
        console.log("Plot: " + results[i].plot)
        console.log("Actors: " + results[i].actors)
        console.log(divider)
    }
    if (results.length < 0) {
        noResults()
    }

}

function noResults() {
    console.log(divider);
    console.log("No criteria was found that matched your search " + searchCriteria)
    console.log(divider);
}

function writeToRandom() {
    // Append the command and the searchCriteria of successful actions to random.txt
    fs.appendFile('random.txt', command + ',' + '"' + searchCriteria + '"' + '\r\n', function (err) {
        if (err) throw err;
    });
}


//this will convert a date from the format it is currently in to the desired return format
function convertDate(dateIn, dateFormatIn, dateFormatOut) {
    return convertedDate = moment(dateIn, dateFormatIn).format(dateFormatOut);
};



function processInput() {
    // If user didn't enter a command, or entered an invalid one, prompt for one
    var commandTilde = command + '~';
    if (command === "" || !commandTilde.indexOf("spotify-this-song~concert-this~movie-this~do-what-it-says~")) {

        inquirer.prompt([
            {
                type: "list",
                name: "doingWhat",
                message: "Select what you would like to search.",
                choices: ["Spotify", "Bands in Town", "Movies", "Pick for me", "Quit"]
            },
            {
                type: "input",
                name: "searchValue",
                message: "What would you like to search for?"
            }


        ]).then(function (input) {

            searchCriteria = input.searchValue;
            console.log("do what " + input.doingWhat)

            //get a random selection from those previously
            if (input.doingWhat === "Pick for me") {
                //console.log("do what " + input.doingWhat)
                command = 'do-what-it-says'
            }
            // convert selection to command
            else if (input.doingWhat === "Spotify") {
                command = 'spotify-this-song';
            }
            else if (input.doingWhat === "Bands in Town") {
                command = 'concert-this'
            }
            else if (input.doingWhat === "Movies") {
                command = "movie-this"
            }
            //quit
            else {
                console.log("return")
                return;
            }
            main();
        });
    }
    else {
        main();
    }
}

function main() {
    console.log("command " + command)
    console.log("search " + searchCriteria)

    //need to get a random command to execute
    if (command === 'do-what-it-says') {
        doRandom();
        console.log("command2 " + command)
    }

    if (command === "movie-this") {
        movie();
    }
    else if (command === "concert-this") {
        concert();
    }
    else if (command === "spotify-this-song") {
        spotifyCall();
    }
    else {
        console.log("command " + command)
    }
}


processInput();

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
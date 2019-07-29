//get the environment variable
require("dotenv").config();

//load up the includes
const inquirer = require('inquirer');
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");

//store the spotify keys in the spotify object for verification
var spotify = new Spotify(keys.spotify);
var results = [];   //will store the results from all three queries
var command = "";   //action they wish to perform.
var crlf = '\r\n';  //carriage return for file i/o new line

//these are the valid commands they can run
var validCommand = ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says"];

//get command line parameters

//this should be the action the user wants to perform
if (process.argv[2] !== undefined) {
    command = process.argv[2].toLowerCase();
}

//this is the lookup value if passed
var searchCriteria = process.argv.splice(3).join(" ");

//separate screen displays
var divider = `${crlf}*--------------------------------------------------------------------------------------------------------*${crlf}`

//Spotify if spotify-this-song is passed.
function spotifyCall() {

    //'The Sign' will be the default if spotify called with no song 
    if (searchCriteria === "" || searchCriteria === null || searchCriteria === undefined) {
        searchCriteria = "Ace of Base The Sign";
    }
    results = [];
    //going to limit it to 10 responses
    spotify.search({ type: 'track', query: searchCriteria, limit: 10 })
        .then(function (response) {
           
            response.tracks.items.forEach(function (ea) {
                var song = ea.name;
                var preview = ea.preview_url;
                var album = ea.album.name;
                //need to pull out the artists as there can be multiple.
                var allArtists = ""; 
                for (var i = 0; i < ea.artists.length; i++) {
                    if (allArtists !== "") {
                        allArtists = allArtists + ", ";
                    }
                    allArtists = allArtists + ea.artists[i].name;
                }

                results.push({
                    artist: allArtists,
                    song: song,
                    preview: preview,
                    album: album
                });
            });

            if (results.length === 0) {
                noResults()
            }
            else {
                printResults();         //send to the console
                writeToRandom();        //add to text file of commands
            }
        })
        .catch(function (err) {
            noResults();
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
            //load everything into an array for processing
            response.data.forEach(function (ea) {
                results.push({
                    venue: ea.venue.name,
                    location: ea.venue.city + ', ' + ea.venue.region,
                    date: convertDate(ea.datetime.substr(0, 10), 'YYYY-MM-DD', 'MM/DD/YYYY')
                });
            })

            if (results.length === 0) {
                noResults()
            }
            else {
                printResults();         //send to the console and log file
                writeToRandom();        //add to text file of commands
            }
        })
        //error or no results
        .catch(function (error) {
            noResults()
        });
}

// movie-this will pull from the OMDB database
function movie() {

    results = [];
    // if no movie is passed, it will display for the movie 'Mr. Nobody'
    if (searchCriteria === "") {
        searchCriteria = "Mr. Nobody";
    }

    axios.get(`http://www.omdbapi.com/?t=${searchCriteria}&y=&plot=short&apikey=trilogy`)
        .then(function (response) {

            //rotten rating does not always exist
            var rottenRating1 = 'N/A';
            if (response.data.Ratings.findIndex(i => i.Source === "Rotten Tomatoes") > -1) {
                rottenRating1 = response.data.Ratings[response.data.Ratings.findIndex(i => i.Source === "Rotten Tomatoes")].Value
            }

            //load everything into an array for processing.
            results.push({
                title: response.data.Title,
                year: response.data.year,
                imdbRating: response.data.imdbRating,
                rottenRating: rottenRating1,
                country: response.data.Country,
                language: response.data.language,
                plot: response.data.Plot,
                actors: response.data.Actors
            });

            if (results.length === 0) {
                console.log("no results")
                noResults()
            }
            else {
                printResults();         //send to the console and log file
                writeToRandom();      //add to text file of commands
            }
        })
        //error or no results
        .catch(function (error) {
            noResults();
        });
};


//if the user want the program to select, will select randomly from random.txt and call the process in the table
function doRandom() {

    // load an array of the values from previously select list (random.txt)
    // The code will store the contents of the reading inside the variable "data"
    fs.readFile("random.txt", "utf8", function (error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }

        //get rid of the line feeds and put into an array
        var regex = /\r\n/gi;
        newData = data.replace(regex, ',').split(",");

        //each entry is in the array not each pair, so need to get an even number back to make sure we get the command first
        var i = getIndex(newData.length);
        if (i > 0 && i % 2 !== 0) {
            i--;
        }

        command = newData[i];
        //need to get rid of the quotes on the search
        regex = /"/gi;
        searchCriteria = newData[i + 1].replace(regex, "");
        //now execute the selected command
        processCommand();
    });

}

//function will return the array value for a random command in random.txt
function getIndex(arrayLength) {
    return Math.floor(Math.random() * (arrayLength - 1));
}

//print results to screen and to the logfile.txt
function printResults() {
    //display the selection made
    console.log(`${crlf}******${command}: ${searchCriteria}******`);
    var printString = `${crlf}******${command}: ${searchCriteria}******$`;
    //loop through the results
    for (var i = 0; i < results.length; i++) {
        console.log(divider);
        printString += divider;
        object = results[i];
        //this will loop through the properties in the array and spit out the propery and the value.
        for (var property in object) {
            console.log(`${property}: ${results[i][property]}`)
            printString += `${property}: ${results[i][property]}${crlf}`;
        }
    }
    printString += divider;
    console.log(divider);
    //send the output to the log file too.
    writeToLog(`log.txt`, printString);
}


//if nothing was found that matches, let them know
function noResults() {
    var wording = `No criteria was found that matched your search ${command}: "${searchCriteria}", please try again`
    console.log(divider);
    console.log(wording)
    console.log(divider);
    var printString = divider + wording + divider;
    writeToLog(`log.txt`, printString);
}

// Append the command and the searchCriteria of successful actions to random.txt
function writeToRandom() {
    writeToLog(`random.txt`, `${command}, "${searchCriteria}"${crlf}`)
}

// Append the screen output to the log.txt
function writeToLog(fileName, writeLine) {
    fs.appendFile(fileName, writeLine, function (err) {
        if (err) throw err;
    });
}

//this will convert a date from the format it is currently in to the desired return format
function convertDate(dateIn, dateFormatIn, dateFormatOut) {
    return convertedDate = moment(dateIn, dateFormatIn).format(dateFormatOut);
};

//will validate what was passed in, and optionally prompt the user if they passed in crap
function processInput() {
    // If user didn't enter a command, or entered an invalid one, prompt for one

    if (command === "" || !validCommand.includes(command)) {

        inquirer.prompt([
            {
                type: "list",
                name: "doingWhat",
                message: "Select what you would like to search.",
                choices: ["Spotify", "Bands in Town", "Movies", "Pick for me", "Quit"]
            },
            {
                //only prompt for the search if one of the first three options selected
                when: function (response) {
                    return (response.doingWhat !== "Pick for me" && response.doingWhat !== "Quit");
                },
                type: "input",
                name: "searchValue",
                message: "What would you like to search for?"
            }
        ]).then(function (input) {

            searchCriteria = input.searchValue;

            //get a random selection from those previously
            if (input.doingWhat === "Pick for me") {
                searchCriteria = "";
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
                return;
            }
            processCommand();
        });
    }
    else {
        processCommand();
    }
}

//once the input is validated, will process the command
function processCommand() {

    //need to get a random command to execute
    if (command === 'do-what-it-says') {
        doRandom();
    }
    else if (command === "movie-this") {
        movie();
    }
    else if (command === "concert-this") {
        concert();
    }
    else if (command === "spotify-this-song") {
        spotifyCall();
    }
    else {
        console.log("command not found " + command)
    }
}

//read in what they entered from the command line and validate
processInput();

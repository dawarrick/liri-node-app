# liri.js - Developed by Deb Warrick

**Liri** is a Nodejs app that will allow you to retrieve information from the Spotify, BandsinTown, and OMDB APIs based on user input

Liri can't be run from a URL, it must be executed using Nodejs


## How it works

You can enter one of the following commands after the node and program commands (node liri), followed by search criteria

spotify-this-song *songname*        information about a selected song.  Will default to "The Sign" if no search criteria entered.
concert-this      *bandname*        concert dates for the selected band.  Will default to "Maroon 5" if no search criteria entered.
movie-this        *moviename*       information for selected movie title.  Will default to "Mr. Nobody" if no search criteria ented.
do-what-it-says                     will select a random command and option from those that had previously been requested.  No search criteria is required.

### Examples
node liri spotify-this-song On the Road Again
node liri concert-this Maroon 5
node liri movie-this Gone with the Wind
node liri do-what-it-says


### Additional features
#### The entries are case insensitive

#### Can't remember the commands?  No Problem! 

##### node liri without any criteria will prompt you to select from a list.

It will only prompt for selection criteria if the command allows for that.

#### Each time you successfully run the app, your entry will be added to the random log for future selection


## Design

**liri** uses the following nodejs libraries

inquirer - to allow for the prompts for the execution
keys - API keys are stored in a .env file to protect them
node-spotify-api - for calls to the Spotify API
axios - for API calls to BandsinTown API and the OMDB API
moment - for date conversion
fs - for file I/O
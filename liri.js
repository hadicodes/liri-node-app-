//Importing all the required node packages
var request = require('request');
var Twitter = require('twitter');
var spotify = require('spotify');
var keys = require('./keys.js');
var fs = require('fs');

//Loads the commands and command actions from process.argv
var parameters = process.argv;
var command = parameters[2];
var commandParameter = parameters[3];

//This function call executes all the command functions
runCommands();

//Runs the various 4 commands in the CLI
function runCommands() {
    if (command === 'my-tweets') {
        myTweets();
    } else if (command === 'spotify-this-song') {
        spotifyThisSong();
    } else if (command === 'movie-this') {
        movieThis();
    } else if (command === 'do-what-it-says') {
        doWhatItSays();
    }
}

//myTweets function: This function retrieves my last 20 tweets
function myTweets() {
    var client = new Twitter(keys.twitterKeys);
    var params = { screen_name: 'hadi_codes', count: 20 };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (error) {
            console.log(error);
        }

        //tweets is an array of objects representing all the tweets
        for (var i = 0; i < tweets.length; i++) {
            console.log(tweets[i].created_at);
            console.log(tweets[i].text);
        }

    });
}

//spotifyThisSong function: This function will show the song's Artist(s)
//     * The song's name, 
// 	   * The album that the song is from, 
// 	   * A preview link of the song from Spotify, 
// 	   * If no song is provided then your program will default to
// 		    "The Sign" by Ace of Base
function spotifyThisSong() {
    //Spotify's "The Sign" by Ace of Base if no command parameter is provided
    if (commandParameter === undefined) {
        commandParameter = 'The Sign by Ace of Base';
    }
    //Searches Spotify
    spotify.search({ type: 'track', query: commandParameter }, function(err, data) {

        if (err) {
            console.log('Error occurred: ' + err);
            return;

        }
        //Song's Artist(s)
        var artists = data.tracks.items[0].artists;
        for (var i = 0; i < artists.length; i++) {
            console.log(artists[i].name);
        }
        //Song Name
        var name = data.tracks.items[0].name;
        console.log(name);
        //Song Spotify Previewlink
        var preview = data.tracks.items[0].external_urls.spotify;
        console.log(preview);
        //Song Album Name
        var album = data.tracks.items[0].album.name;
        console.log(album);

    });
}


//movie-this Function
function movieThis() {
    var movieTitle;
    //Default to movie Mr Nobody is command parameter is not provided
    if (commandParameter === undefined) {
        movieTitle = 'Mr+Nobody';
    } else {
        //Uses Regex to replace sepcial chars with a plus
        movieTitle = commandParameter.replace(/[^a-zA-Z0-9]/g, '+');
    }
    // Run a request to the OMDB API with the movie specified 
    var queryUrl = 'http://www.omdbapi.com/?t=' + movieTitle + '&i=&&plot=short&r=json&tomatoes=true';

    request(queryUrl, function(error, response, body) {

        // If the request is successful (i.e. if the response status code is 200)
        if (!error && response.statusCode == 200) {

            // Parse the body of the site and recover just the imdbRating
            // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it). 
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Release Year: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Country: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
            console.log('Rotten Tomatoes Rating: ' + JSON.parse(body).tomatoRating);
            console.log('Rotten Tomatoes URL: ' + JSON.parse(body).tomatoURL);
        }
    });
}
//Do What it says Function. Reads the random.txt file and retreives the data contents to be used in te CLI
function doWhatItSays() {
    fs.readFile('random.txt', 'utf8', function(err, data) {
        if (err) {
            console.log(err);
        }
        var retrievedData = data.split(',');
        command = retrievedData[0];
        commandParameter = retrievedData[1];
        runCommands();
    });
}

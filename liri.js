function log(m) {
    console.log(m);
}

require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
const axios = require('axios');
const fs = require('fs');

var spotify = new Spotify(keys.spotify);

var command = process.argv[2];
var query = process.argv.slice(3).join(" ");

function execute(c, q) {
    switch(c) {
        case "concert-this":
            axios.get("https://rest.bandsintown.com/artists/" + q + "/events?app_id=codingbootcamp")
                .then(function (response) {
                    //log(response.data);
                    var result = response.data;
                    for (x of result) {
                        var output =    "Venue: " + x.venue.name + "\n" +
                                        "Location: " + x.venue.country + "\n" +
                                        "Date: " + x.datetime + "\n";
                        log(output);
                    }
                });
            break;
    
        case "spotify-this-song":
            // log("spotify-this-song");
            spotify.search({ type: 'track', query: q, limit: 1 })
            .then(function(response) {
                var artists = response.tracks.items[0].album.artists;
                log("Artists(s): ");
                for (x of artists) {
                    log(x.name + " ");
                }
                // log(artists);
                log("Song Name: " + response.tracks.items[0].name);
                log("Preview Link: " + response.tracks.items[0].preview_url);
                log("Album: " + response.tracks.items[0].album.name);
            })
            .catch(function(err) {
              console.log(err);
            });
            break;
    
        case "movie-this":
            axios.get('http://www.omdbapi.com/?apikey=trilogy&t=' + q + "&plot=full")
                .then(function (response) {
                    var result = response.data;
                    var output =    "Title: " + result.Title + "\n" +
                                    "Year: " + result.Year + "\n" +
                                    "IMDB Rating: " + result.Ratings[0].Value + "\n" +
                                    "Rotten Tomatoes Rating: " + result.Ratings[1].Value + "\n" +
                                    "Country: " + result.Country + "\n" +
                                    "Language: " + result.Language + "\n" +
                                    "Plot: " + result.Plot + "\n" +
                                    "Actors: " + result.Actors;
                    log(output);
                });
            break;
        case "do-what-it-says":
            // log("do-what-it-says");
            fs.readFile('random.txt', "utf8", function read(err, data) {
                if (err) {
                    throw err;
                }
                // console.log(data.split(',')[0]);
                execute(data.split(',')[0], data.split(',')[1])
    
            });        
            break;
        default:
            log("invalid command");
    }
}

execute(command, query);
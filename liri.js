var connect = require("./keys.js");

var keys = connect.twitterKeys;

var command = process.argv[2];

switch (command) {

	case "my-tweets":
		//console logs my last 20 tweets and when they were created
		break;

	case "spotify-this-song":
		//searches up the artist, song name, preview link, and album from spotify
		//if no song is provided, defaults to the sign by ace of base
		break;

	case "movie-this":
		//searches a movie name, and console logs the title, year, IMDB rating, Rotten tomatoes rating, production country, language, plot, and actors
		//defaults to Mr. Nobody
		var title = process.argv[3];
		var queryURL = "https://www.omdbapi.com/?&apikey=40e9cece&t=" + title;

		$.ajax({
			url: queryURL,
			method: "GET"
		}).done(function(response) {
			console.log(response);

		});
		break;

	case "do-what-it-says":
		//takes in a command from random.txt
		break;

}
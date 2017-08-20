var request = require("request");

//Writes to a file if the last process argument value is true, otherwise console logs it
var printToFile, fs, filename;
if(process.argv[process.argv.length - 1] === "true") {
	printToFile = true;
	// Core node package for reading and writing files
	fs = require("fs");
	//filename to write/append to
	filename = "log.txt";
}
else {
	printToFile = false;
}

//Directs the file on the third process argument value
var command = process.argv[2];

switch (command) {

	case "my-tweets":
		//console logs my last 20 tweets and when they were created
		var connect = require("./keys.js");
		var keys = connect.twitterKeys;
		break;

	case "spotify-this-song":
		//searches up the artist, song name, preview link, and album from spotify
		//if no song is provided, defaults to the sign by ace of base
		break;

	case "movie-this":
		//Searches a movie name and returns its information
		
		//If no movie is entered, defaults to Mr. Nobody
		var title = "Mr. Nobody";
		if(process.argv[3] !== undefined && process.argv[3]!== "true") {
			title = process.argv[3];
		}

		//Searches OMDB using an API key and the movie name
		var queryURL = "https://www.omdbapi.com/?&apikey=40e9cece&t=" + title;

		request(queryURL, function(error, response, body){

			// If the request was successful...
  			if (!error && response.statusCode === 200) {
  				//Parses the body into a JSON object
  				var parsed = JSON.parse(body);

  				var message = "Title: " + parsed.Title + "\n"
  							+ "Year Released: " + parsed.Year + "\n"
  							+ "IMDB Rating: " + parsed.Ratings[0].Value + "\n"
	  						+ "Rotten Tomatoes Rating: " + parsed.Ratings[1].Value + "\n"
	  						+ "Produced in: " + parsed.Country + "\n"
	  						+ "Languages: " + parsed.Language + "\n"
	  						+ "Plot: " + parsed.Plot + "\n"
	  						+ "Actors: " + parsed.Actors + "\n"
	  						+ "================================" + "\n";

  				//Prints information to filename if printToFile is true; otherwise console logs
  				if(printToFile) {
  					var message = 
  					fs.appendFile(filename, message, function(err) {

					  // If the code experiences any errors it will log the error to the console.
					  if (err) {
					    return console.log(err);
					  }
					  //Console logs that the info was printed to filename
					  console.log("Printed to", filename);

					});
  				}
  				else {
	  				console.log(message);
	  			}
			}
		});
		break;

	case "do-what-it-says":
		//takes in a command from random.txt
		break;

}
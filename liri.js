//Allows you to execute one of four functions in node via Terminal/Command Prompt
//node liri.js my-tweets will read my last tweets
//node liri.js spotify-this-song <songname> will return information about the song
//node liri.js movie-this <moviename> will return information about a movie
//node liri.js do-what-it-says will take in a command from random.txt and execute it

var fs, printToFile, filename;

//Writes to a file if the last process argument value is true, otherwise console logs it
if(process.argv[process.argv.length - 1] === ".true") {
	printToFile = true;
	// Core node package for reading and writing files
	fs = require("fs");
	//filename to write/append to
	filename = "log.txt";
}
else {
	printToFile = false;
}

var arg = "";
//Processes the 4th and beyond process arguments as necessary and stores in arg
for (var i = 3; i < process.argv.length; i++) {
	//If the last entry in the array, checks if it's .true, .false, or undefined before adding
	if(i === process.argv.length - 1) {
		if(process.argv[i] !== undefined && process.argv[i] !== ".true" & process.argv[i] !== ".false") {
			arg += process.argv[i];	
		}	
	}
	//Otherwise, just adds it to arg
	else {
		arg += process.argv[i] + " ";
	}
}

//Directs the function on the third process argument value and passes it arg
execute(process.argv[2], arg);

function execute(command, argument) {

	switch (command) {

		case "my-tweets":
			//console logs my last 20 tweets and when they were created
			var twitter = require("./keys.js");
			var keys = connect.twitterKeys;
			console.log(command, "Will read you your tweets");
			break;

		//===================================================

		case "spotify-this-song": //Uses spotify to provide information about a song
			
			//if no song is provided, defaults to the sign by ace of base
			
			//links to the keys.js to provide the keys for spotify
			var spotifyKeys = require("./keys.js").spotifyKeys;
			
			//pulls in the node spotify API to connect 
			var Spotify = require("node-spotify-api");
 
 			//creates a new Spotify object with my API keys in the object
			var spotify = new Spotify({
				id: spotifyKeys["clientID"],
				secret: spotifyKeys["clientSecret"]
			});

			//Song Title is equal to the passed argument; else, defaults to 'The Sign' by Ace of Base
			var songTitle = "The Sign";
			if(argument != "") {
				songTitle = argument;
			}

			//Searches for 1 track with the name in argument
			spotify.search({ type: 'track', query: songTitle, limit: 1 }, function(err, data) {
				if (err) {
			    	return console.log('Error occurred: ' + err);
			  	}
			
			 	message = "Artist: " + data.tracks["items"][0].artists[0].name + "\n"
			 			+ "Song: " + data.tracks["items"][0].name + "\n"
			 			+ "Album: " + data.tracks["items"][0].album.name + "\n"
			 			+ "Preview: " + data.tracks["items"][0].preview_url + "\n"
			 			+ "================================\n";

				if(printToFile) {
					print(message);
				}
				else {
					console.log(message);
				}
			});
			break;

		//===================================================

		case "movie-this": //Searches a movie name and returns its information

			var request = require("request");

			//If no movie is entered, defaults to Mr. Nobody
			var title = "Mr. Nobody";
			if(arg !== "") {
				title = argument;
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
		  						+ "================================\n";

	  				//Prints information to filename if printToFile is true; otherwise console logs
	  				if(printToFile) {
	  					print(message);
	  				}
	  				else {
		  				console.log(message);
		  			}
				}
			});
			break;

		//===================================================

		case "do-what-it-says": //Takes in a command and arguments from random.txt

			// Core node package for reading and writing files
			fs = require("fs");

			//reads the command from random.txt in utf-8 format
			fs.readFile("./random.txt", "utf8", function(error, data) {
				// If the code experiences any errors it will log the error to the console.
				if (error) {
			  		return console.log(error);
				}

				var fileCommand, fileArgs;

				//Processes the file depending on if there is a comma
				if(data.indexOf(",") > -1) {
					//Breaks file contents into variables
					fileCommand = data.substring(0,data.indexOf(",")); //text before the comma
					fileArgs = data.substr(data.indexOf(",") + 2); //text after the comma and quotation mark
					fileArgs = fileArgs.slice(0, -1); //removes the last character from fileArgs, the second quotation mark
				}
				else {
					//Sets fileCommand to the string, and fileArgs to blank
					fileCommand = data;
					fileArgs = "";
				}
				//Calls execute with the command and argument from the file
				execute(fileCommand, fileArgs);
			});

			break;
		
		default: //default message if the command is not one of the above
			var message = "I'm sorry, that's not one of my commands. Try 'my-tweets', 'spotify-this-song', 'movie-this', or 'do-what-it-says'.";
			if(printToFile) {
				print(message);
			}
			else {
				console.log(message);
			}
			break;
	}	
}

//Prints fileMessage in the filename
function print(fileMessage) {
	//Appends the message to filename
	fs.appendFile(filename, fileMessage, function(err) {

		// If the code experiences any errors it will log the error to the console.
		if (err) {
			return console.log(err);
		}
		//Console logs that the info was printed to filename
		console.log("Printed to", filename, "\n================================\n");

	});
}
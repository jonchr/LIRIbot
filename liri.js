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

		case "my-tweets": //Returns the last 20 tweets from my account and when they were created
	
			//links to keys.js to provide the keys for twitter
			var twitterKeys = require("./keys.js").twitterKeys;
			
			var Twitter = require('twitter');
 
			var client = new Twitter({
			  consumer_key: twitterKeys["consumer_key"],
			  consumer_secret: twitterKeys["consumer_secret"],
			  access_token_key: twitterKeys["access_token_key"],
			  access_token_secret: twitterKeys["access_token_secret"]
			});
			 
			var params = {screen_name: 'Jonchr_gw'};
			client.get('statuses/user_timeline', params, function(error, tweets, response) {
			  if (!error) {
			  	var message = "";
			  	//prints out the last twenty tweets for everyone to see!
			  	for (var i = 0; i < 20; i++) {
			  		message += tweets[i].user.screen_name + " (" 
		  					+ tweets[i].created_at.substring(0, tweets[i].created_at.indexOf("+") - 4) + "): "
		  					+ tweets[i].text + "\n";
			  	} 
			  	message += "================================\n";
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

		case "spotify-this-song": //Uses spotify to provide information about a song
			
			//links to  keys.js to provide the keys for spotify
			var spotifyKeys = require("./keys.js").spotifyKeys;
			
			//pulls in the node spotify API to connect 
			var Spotify = require("node-spotify-api");
 
 			//creates a new Spotify object with my API keys in the object
			var spotify = new Spotify({
				id: spotifyKeys["clientID"],
				secret: spotifyKeys["clientSecret"]
			});

			//Song Title is equal to the passed argument; else, defaults to 'The Sign' by Ace of Base
			var songTitle = "The Sign Ace";
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

		//===================================================

		case "play-this-song": //Opens the spotify preview URL to play a short clip of the song

			//links to  keys.js to provide the keys for spotify
			var spotifyKeys = require("./keys.js").spotifyKeys;
			
			//pulls in the node spotify API to connect 
			var Spotify = require("node-spotify-api");
 
 			//creates a new Spotify object with my API keys in the object
			var spotify = new Spotify({
				id: spotifyKeys["clientID"],
				secret: spotifyKeys["clientSecret"]
			});

			//Song Title is equal to the passed argument; else, defaults to 'The Sign' by Ace of Base
			var songTitle = "The Sign Ace";
			if(argument != "") {
				songTitle = argument;
			}

			//Searches for 1 track with the name in argument
			spotify.search({ type: 'track', query: songTitle, limit: 1 }, function(err, data) {
				if (err) {
			    	return console.log('Error occurred: ' + err);
			  	}

			  	var URL = data.tracks["items"][0].preview_url;

			  	//Uses OpenURL to open the preview URL from spotify
			  	require("openurl").open(URL);
			
				//Creates a message to console log/file log
			 	message = "Opening web page to play song preview"
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
		
		default: //default message if the command is not one of the above
			var message = "I'm sorry, that's not one of my commands. Try 'my-tweets', 'spotify-this-song', 'movie-this', or 'do-what-it-says'.\n";
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
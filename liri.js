require("dotenv").config();
const keys = require("./keys.js");
const Spotify = require("node-spotify-api");
const Twitter = require("twitter");
const request = require("request");
const fs = require("fs");
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

const handler = {
	"spotify-this-song" : getSpotify,
	"my-tweets" : getTweets,
	"movie-this" : getMovie,
	"do-what-it-says" : readFile
}
function getTweets(arg){
	var query = (arg||"TheSamLloyd");
	client.get('statuses/user_timeline', {screen_name : arg}, function(err, tweets, response){
		if (err){
			console.log("error: "+err);
			return;
		}
		console.log("Tweets from @"+query+":")
		Object.keys(tweets).forEach(function(tweet){
			logger(tweets[tweet].created_at)
			logger(tweets[tweet].text)
		})
	})
}
function getSpotify(arg){
	var query = (arg||"ace of base the sign");
	if (query==arg) console.log("searching Spotify for "+query+"...");
	spotify.search({type:"track",query:query,limit:1},function(err,data){
		if(err){
			console.log("error: "+err)
			return;
		}
		var song = data.tracks.items[0];
		logger("Artist: "+song.artists[0].name);
		logger("Title: "+song.name);
		logger("Album: "+song.album.name);
		logger("Link: "+song.external_urls.spotify)
	})
}
function getMovie(arg){
	var query = (arg||"Mr. Nobody");
	var queryUrl = "http://www.omdbapi.com/?t=" + query + "&y=&plot=short&apikey=trilogy";
	request(queryUrl,function(err,res,body){
		var movie = JSON.parse(body);
		logger("Title: "+movie.Title)
		logger("Released: "+movie.Released)
		logger("Rating: "+movie.Ratings[0].Value)
		logger("Country: "+movie.Country)
		logger("Language: "+movie.Language)
		logger("Plot: "+movie.Plot)
		logger("Starring: "+movie.Actors)
	});
}
function readFile(){
	fs.readFile("random.txt","utf8",function(error,data){
		if(error){
			console.log(error);
			return;
		}
		var data = data.split(" ");
		process.argv[2] = data[0];
		process.argv[3] = data.slice(1).join(" ");
		main();
	})
}
function logger(str){
	fs.appendFile("logger.txt",str+"\n", function(err){
		if (err){
		console.log("error: "+err)}
	});
	console.log(str)
}
function main(){
	var command = process.argv[2];
	var arg = (process.argv.slice(3).join(" "));
	handler[command](arg);
}
main();
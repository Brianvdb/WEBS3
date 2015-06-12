var server = "https://zeeslagavans.herokuapp.com/";
var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ImNqZ2hldW1lQGF2YW5zLm5sIg.DNq6H0fKb5NofVyq3kQPdWZLEiPdwFLSmCw0EXDZ_CE";

$(function () {
	var app = new App(server, token);

	app.switchView('list');

	/*app.getGameList(function(gameList) {
	 var gameEntries = gameList.getGames();
	 for(var i = 0; i < gameEntries.length; i++) {
	 //console.log("GameEntry: " + gameEntries[i].getId());
	 console.log("game");
	 console.log("id: " + gameEntries[i].getId());
	 app.getGame(function() { }, gameEntries[i].getId());
	 }
	 });*/
});
var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ImJjZi52YW5kZW5icm9la0BzdHVkZW50LmF2YW5zLm5sIg.iLaYq3RoRTzZ21RMG0L9RPcOYF2CZBp3pWcKR6hJKek";

$(function() {
	var app = new App(token);

	app.requestGameList();
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
var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ImJjZi52YW5kZW5icm9la0BzdHVkZW50LmF2YW5zLm5sIg.iLaYq3RoRTzZ21RMG0L9RPcOYF2CZBp3pWcKR6hJKek";

$(function() {
	var app = new App(token);
	
	app.getShips(function(ships) {
        for(var i = 0; i < ships.length; i++) {
            console.log(ships[i].getName());
        }
    });
	
	/*app.getGameList(function(gameList) {
		var games = gameList.getGames();
		for(var i = 0; i < games.length; i++) {
			//console.log("Game: " + games[i].getId());
			console.log("game");
			console.log("id: " + games[i].getId());
			app.getGame(function() { }, games[i].getId());
		}
	});*/
});
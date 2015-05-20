function Gamelist(games) {
	this.games = [];
	// parse games
	for(var i = 0; i < games.length; i++) {
		this.games[i] = new Game(games[i]._id, games[i].status, games[i].enemyId, games[i].enemyName);
	}
}

Gamelist.prototype = {
	getGames: function() { return this.games }
}
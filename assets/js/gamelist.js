function Gamelist(games) {
	this.games = [];
	// parse games
	for(var i = 0; i < games.length; i++) {
		this.games[i] = new GameEntry(games[i]._id, games[i].status, games[i].enemyId, games[i].enemyName, games[i].isAI);
	}
}

Gamelist.prototype = {
	getGames: function() { return this.games }
}
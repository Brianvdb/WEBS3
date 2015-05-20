function Gamelist(games) {
	this.gameEntries = [];
	// parse gameEntries
	for(var i = 0; i < games.length; i++) {
		this.gameEntries[i] = new GameEntry(games[i]._id, games[i].status, games[i].enemyId, games[i].enemyName);
	}
}

Gamelist.prototype = {
	getGames: function() { return this.gameEntries }
}
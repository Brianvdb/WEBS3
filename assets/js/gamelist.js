function Gamelist(games) {
	this.gameEntries = [];
	// parse gameEntries
	for(var i = 0; i < games.length; i++) {
		this.gameEntries[i] = new GameEntry(games[i]._id, games[i].status, games[i].player1, games[i].player2, games[i].isAI);
	}
}

Gamelist.prototype = {
	getGames: function() { return this.gameEntries }
}
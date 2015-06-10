function Gamelist(games) {
	this.gameEntries = [];

	this.queuedGames = [];
	this.doneGames = [];
	this.setupGames = [];
	this.startedGames = [];

	// parse gameEntries
	for (var i = 0; i < games.length; i++) {
		var entry = new GameEntry(games[i]._id, games[i].status, games[i].enemyId, games[i].enemyName);
		this.gameEntries[i] = entry;
		var arr;
		switch(entry.getStatus()) {
			case 'que':
				arr = this.queuedGames;
				break;
			case 'done':
				arr = this.doneGames;
				break;
			case 'setup':
				arr = this.setupGames;
				break;
			case 'started':
				arr = this.startedGames;
				break;
			default:
				console.log('Help me, please!');
				return;
		}
		arr.push(entry);
	}
}

Gamelist.prototype = {
	getGames: function () {
		return this.gameEntries;
	},
	getQueueGames: function() {
		return this.queuedGames;
	},
	getSetupGames: function() {
		return this.setupGames;
	},
	getDoneGames: function() {
		return this.doneGames;
	},
	getStartedGames: function() {
		return this.startedGames;
	}
}
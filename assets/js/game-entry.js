// GameEntry: initialized by GameList

function GameEntry(id, status, player1, player2, isAI) {
	this.id = id;
	this.status = status;
	this.player1 = player1;
	this.player2 = player2;
    this.isAI = isAI;
}

GameEntry.prototype = {
	getId: function() { return this.id; },
	getStatus: function() { return this.status },
	getPlayer1: function() { return this.player1 },
	getPlayer2: function() { return this.player2 },
    isAI: function() { return this.isAI }
}


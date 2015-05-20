function Game(id, status, enemyId, enemyName, isAI) {
	this.id = id;
	this.status = status;
	this.enemyId = enemyId;
	this.enemyName = enemyName;
    this.isAI = isAI;
}

Game.prototype = {
	setBoard: function(board) { this.board = board; },
	getBoard: function() { return this.board; },
	setEnemyBoard: function(board) { this.enemyBoard = board; },
	getEnemyBoard: function() { return this.enemyBoard; },
	getId: function() { return this.id; },
	getStatus: function() { return this.status },
	getEnemyId: function() { return this.enemyId },
	getEnemyName: function() { return this.enemyName },
    isAI: function() { return this.isAI }
}


// GameEntry: initialized by GameList

function GameEntry(id, status, enemyId, enemyName, isAI) {
	this.id = id;
	this.status = status;
	this.enemyId = enemyId;
	this.enemyName = enemyName;
    this.isAI = isAI;
}

GameEntry.prototype = {
	getId: function() { return this.id; },
	getStatus: function() { return this.status },
	getEnemyId: function() { return this.enemyId },
	getEnemyName: function() { return this.enemyName },
    isAI: function() { return this.isAI }
}


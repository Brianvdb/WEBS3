// GameEntry: initialized by GameList

function GameEntry(id, status, enemyId, enemyName) {
	this.id = id;
	this.status = status;
	this.enemyId = enemyId;
    this.enemyName = enemyName;

}

GameEntry.prototype = {
	getId: function() { return this.id; },
	getStatus: function() { return this.status },
	getEnemyId: function() { return this.enemyId },
	getEnemyName: function() { return this.enemyName }
}


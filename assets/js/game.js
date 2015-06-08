function Game(id, status, yourTurn, enemyId, enemyName) {
	this.id = id;
	this.status = status;
	this.yourTurn = yourTurn;
	this.enemyId = enemyId;
	this.enemyName = enemyName;
}

Game.prototype = {
	getId: function() {
        return this.id;
    },

	getStatus: function() {
        return this.status;
    },

	isYourTurn: function() {
        return this.yourTurn;
    },

	getEnemyId: function() {
        return this.enemyId;
    },

	getEnemyName: function() {
        return this.enemyName;
    },

    setMyBoard: function(board) {
        this.myBoard = board;
    },

    setEnemyBoard: function(board) {
        this.enemyBoard = board;
    },

	getMyBoard: function() {
        return this.myBoard;
    },

	getEnemyBoard: function() {
        return this.enemyBoard;
    }
}

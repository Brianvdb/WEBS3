function Game(id, status, yourTurn, enemyId, enemyName, myBoard, enemyBoard) {
    this.id = id;
    this.status = status;
    this.yourTurn = yourTurn;
    this.enemyId = enemyId;
    this.enemyName = enemyName;
    this.myBoard = myBoard;
    this.enemyBoard = enemyBoard;
}

Game.prototype = {
    getId: function() { return this.id },
    getStatus: function() { return this.status },
    isYourTurn: function() { return this.yourTurn },
    getEnemyId: function() { return this.enemyId },
    getEnemyName: function() { return this.enemyName },
    getMyBoard: function() { return this.myBoard },
    getEnemyBoard: function() { return this.enemyBoard }
}

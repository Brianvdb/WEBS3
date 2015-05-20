// Controller, interacts with the Zeeslag API

function App(token) {
	this.token = token;
}

App.prototype = {
	requestGameList: function() {
		var url = "http://zeeslagavans.herokuapp.com/users/me/games?token=" + this.token;
        var self = this;
		$.get( url, function( data ) {
			console.log(data);
			self.onGameListReceived(new Gamelist(data));
		}).fail(function() {
			// TODO: handle fail
		});
	},
	
	requestNewGame: function() {
		var url = "http://zeeslagavans.herokuapp.com/games?token=" + this.token;
        var self = this;
		$.get( url, function( data ) {
			// TODO: handle data
			console.log(data);
            self.onNewGameCreated(data);
		}).fail(function() {
			// TODO: handle fail
		});
	},
	
	requestGame: function(id) {
		var url = "http://zeeslagavans.herokuapp.com/games/" + id + " ?token=" + this.token;
        var self = this;
		$.get( url, function( data ) {
			console.log(data);
            var game;

            if(data.status == 'que') {
                game = new Game(data._id, data.status);
            } else if(data.status == 'setup') {
                game = new Game(data._id, data.status, data.yourTurn, data.enemyId, data.enemyName);
            } else if(data.status == 'started' || data.status == 'done') {
                // TODO: parse boards
                game = new Game(data._id, data.status, data.yourTurn, data.enemyId, data.enemyName);
            } else {
                console.log("Unknown game state: " + data.status);
                return;
            }

            self.onGameReceived(game);

		}).fail(function() {
			// TODO: handle fail
		});
	},
	
	requestShips: function() {
		var url = "http://zeeslagavans.herokuapp.com/ships?token=" + this.token;
        var self = this;
		$.get( url, function( data ) {
            var ships = [];
			for(var i = 0; i < data.length; i++) {
                var s = data[i];
                ships[i] = new Ship(s._id, s.length, s.name);
            }
            self.onShipsReceived(ships);
		}).fail(function() {
			// TODO: handle fail
		});
	},

    postGameBoard: function(game) {
        // TODO: implement this

    },

    shoot: function(game, x, y) {

    },

    onShipsReceived: function(ships) {
        // update board view with ships
        console.log("ships received");
    },
	
	onGameListReceived: function(gameList) {
		// update views..
        for(var i = 0; i < gameList.getGames().length; i++) {
            var gameEntry = gameList.getGames()[i];

            this.requestGame(gameEntry.getId());
        }
	},
	
	onGameReceived: function(game) {
		console.log("id: " + game.getId() + ", status: " + game.getStatus() + ", your turn: " + game.isYourTurn() + ", enemyId: " + game.getEnemyId() + ", enemyName: " + game.getEnemyName());
	},
	
	onNewGameCreated: function(data) {
		// update views, check what happened
	}
}
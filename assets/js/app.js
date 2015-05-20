// Controller, API

function App(token) {
	this.token = token;
}

App.prototype = {
	getGameList: function(callback) {
		var url = "http://zeeslagavans.herokuapp.com/users/me/games?token=" + this.token;
		$.get( url, function( data ) {
			console.log(data);
			// return gamelist
			callback(new Gamelist(data));
		}).fail(function() {
			// TODO: handle fail
		});
	},
	
	newGame: function(callback) {
		var url = "http://zeeslagavans.herokuapp.com/games?token=" + this.token;
		$.get( url, function( data ) {
			// TODO: handle data
			console.log(data);
		}).fail(function() {
			// TODO: handle fail
		});
	},
	
	getGame: function(callback, id) {
		var url = "http://zeeslagavans.herokuapp.com/games/" + id + " ?token=" + this.token;
		$.get( url, function( data ) {
			// TODO: handle data
			console.log(data);
		}).fail(function() {
			// TODO: handle fail
		});
	},
	
	getShips: function(callback) {
		var url = "http://zeeslagavans.herokuapp.com/ships?token=" + this.token;
		$.get( url, function( data ) {
            var ships = [];
			for(var i = 0; i < data.length; i++) {
                var s = data[i];
                ships[i] = new Ship(s._id, s.length, s.name);
            }
            callback(ships);
		}).fail(function() {
			// TODO: handle fail
		});
	},

    onShipsReceived: function(ships) {
        // update board view with ships
    },
	
	onGameListReceived: function(gameList) {
		// update views..
	},
	
	onGameReceived: function(game) {
		
	},
	
	onNewGameCreated: function(data) {
		// update views, check what happened
	}
}
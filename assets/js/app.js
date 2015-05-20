// Controller, API

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
		$.get( url, function( data ) {
			// TODO: handle data
			console.log(data);
		}).fail(function() {
			// TODO: handle fail
		});
	},
	
	requestGame: function(id) {
		var url = "http://zeeslagavans.herokuapp.com/games/" + id + " ?token=" + this.token;
		$.get( url, function( data ) {
			// TODO: handle data
			console.log(data);
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

    onShipsReceived: function(ships) {
        // update board view with ships
        console.log("ships received");
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
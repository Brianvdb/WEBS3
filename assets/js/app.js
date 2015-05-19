// Controller, API

var App = function(token) {
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
			// TODO: handle data
			console.log(data);
		}).fail(function() {
			// TODO: handle fail
		});
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
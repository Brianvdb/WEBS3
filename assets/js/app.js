// Controller, interacts with the Zeeslag API

function App(server, token) {
    this.server = server;
	this.token = token;
    this.setupBoardView = new SetupBoardView(this);
    this.listView = new GameListView(this);
    this.currentView = undefined;
    this.socket = io.connect(server, { query: "token=" + token });

    var self = this;
    this.socket.on('update', function(gameId) {
        self.onGameUpdate(gameId);
    });
}

App.prototype = {
	requestGameList: function() {
		var url = this.server + "users/me/games?token=" + this.token;
		var self = this;
		$.get( url, function( data ) {
			self.onGameListReceived(new Gamelist(data));
		}).fail(function() {
			// TODO: handle fail
		});
	},
	
	requestNewGame: function(computer) {
        var url;
        if(computer) {
            url = this.server + "games/AI?token=" + this.token;
        } else {
            url = this.server + "games?token=" + this.token;
        }

		var self = this;
		$.get( url, function( data ) {
			// TODO: handle data
			console.log(data);
			self.onNewGameCreated(data);
		}).fail(function() {
			// TODO: handle fail
		});
	},
	
	requestGame: function(id, callback) {
		var url = this.server + "games/" + id + " ?token=" + this.token;
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

            if(callback) {
                callback(game);
            } else {
                self.onGameReceived(game);
            }

		}).fail(function() {
			// TODO: handle fail
		});
	},
	
	requestShips: function() {
		var url = this.server + "ships?token=" + this.token;
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

        if(this.currentView == this.setupBoardView) {
            this.setupBoardView.onShipsReceived(ships);
        }
	},
	
	onGameListReceived: function(gameList) {
		// update views..
        if(this.currentView == this.listView) {
            this.listView.onGameListReceived(gameList);
        }
	},
	
	onGameReceived: function(game) {
		console.log("id: " + game.getId() + ", status: " + game.getStatus() + ", your turn: " + game.isYourTurn() + ", enemyId: " + game.getEnemyId() + ", enemyName: " + game.getEnemyName());
	},
	
	onNewGameCreated: function(data) {
		// update views, check what happened
        if(this.currentView == this.listView) {
            this.listView.onGameCreated(data);
        }
	},

    onGameUpdate: function(gameId) {
        console.log('on game update: ' + gameId);
    },

    removeGames: function(data) {
        var self = this;
        var url = this.server + "users/me/games?token=" + this.token;

        $.ajax({
            url: url,
            type: 'DELETE',
            success: function(result) {
                if(self.currentView == self.listView) {
                    self.listView.onGamesRemoved();
                }
            }
        });
    },

    switchView: function(view, obj) {
        var self = this;
        switch(view) {
            case "setupboard":
                $.get('assets/views/setupboard.html', function(data) {
                    $('#view').html(data);
                    self.currentView = self.setupBoardView;
                    self.setupBoardView.init(obj);
                });
                break;
            case "list":
                $.get('assets/views/gamelist.html', function(data) {
                    $('#view').html(data);
                    self.currentView = self.listView;
                    self.listView.init();
                });
                break;

        }
    }
}
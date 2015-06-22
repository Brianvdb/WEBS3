// Controller, interacts with the Zeeslag API

function App(server, token) {
	this.server = server;
	this.token = token;
	this.languages = new Languages();
	this.setupBoardView = new SetupBoardView(this);
	this.listView = new GameListView(this);
	this.gameView = new GameBoardView(this);
	this.currentView = undefined;
	this.socket = io.connect(server, {query: "token=" + token});

	var self = this;
	this.socket.on('update', function (gameId) {
		self.onGameUpdate(gameId);
	});
}

App.prototype = {
	requestGameList: function () {
		var url = this.server + "users/me/games?token=" + this.token;
		var self = this;
		$.get(url, function (data) {
			self.onGameListReceived(new Gamelist(data));
		});
	},

	requestNewGame: function (computer) {
		var url = (computer ? this.server + "games/AI?token=" + this.token : url = this.server + "games?token=" + this.token);

		var self = this;
		$.get(url, function (data) {
			console.log(data);
			self.onNewGameCreated(data);
		});
	},

	requestGame: function (id, callback) {
		var url = this.server + "games/" + id + " ?token=" + this.token;
		var self = this;
		$.get(url, function (data) {
			console.log(data);
			var game;

			if (data.status == 'que') {
				game = new Game(data._id, data.status);
			} else if (data.status == 'setup') {
				game = new Game(data._id, data.status, data.yourTurn, data.enemyId, data.enemyName);
			} else if (data.status == 'started' || data.status == 'done') {
				game = new Game(data._id, data.status, data.yourTurn, data.enemyId, data.enemyName);

				game.setMyBoard(self.parseBoard(data.myGameboard, false));
				game.setEnemyBoard(self.parseBoard(data.enemyGameboard, true));
			} else {
				console.log("Unknown game state: " + data.status);
				return;
			}

			if (callback) {
				callback(game);
			} else {
				self.onGameReceived(game);
			}

		});
	},

	parseBoard: function (jsonBoard, isEnemy) {
		var board = new Board(10);
		var shotArray = jsonBoard.shots;
		if (shotArray) {
			for (var i = 0; i < shotArray.length; i++) {
				var shot = shotArray[i];
				var x = shot.x.charCodeAt(0) - 97;
				var y = shot.y - 1;
				board.hit(x, y, shot.isHit);
			}
		}
		if (!isEnemy) {
			var shipArray = jsonBoard.ships;
			var ships = [];
			for (var i = 0; i < shipArray.length; i++) {
				var shipObject = shipArray[i];
				ships[i] = new Ship(shipObject._id, shipObject.length, shipObject.name);
				ships[i].setVertical(shipObject.isVertical);
				var x = shipObject.startCell.x.charCodeAt(0) - 97;
				var y = shipObject.startCell.y - 1;
				ships[i].setStartCell(x, y);
				board.addShip(ships[i], x, y, !ships[i].isVertical());
			}
		}
		return board;
	},

	requestShips: function () {
		var url = this.server + "ships?token=" + this.token;
		var self = this;
		$.get(url, function (data) {
			var ships = [];
			for (var i = 0; i < data.length; i++) {
				var s = data[i];
				ships[i] = new Ship(s._id, s.length, s.name, s.__v);
			}
			self.onShipsReceived(ships);
		});
	},

	postGameBoard: function (gameId, ships) {
		var url = this.server + "games/" + gameId + "/gameboards?token=" + this.token;
		var shipArray = [];

		for (var i = 0; i < ships.length; i++) {
			var ship = ships[i];
			var shipObject = {
				"_id": ship.getId(),
				"length": ship.getLength(),
				"name": ship.getName(),
				"startCell": ship.getStartCell(),
				"isVertical": ship.isVertical(),
				"__v": ship.getV()
			}
			shipArray.push(shipObject);
		}

		var postObject = {"ships": shipArray};
		var self = this;

		$.post(url, postObject)
			.done(function (data) {
				if (data.msg && data.msg == "success") {
					self.showError('board has been posted', 1500);
					self.onGameBoardPosted(gameId, data.status);
					self.switchView('list');
				} else {
					self.showError('board has not been posted', 1500);
				}
			});

	},

	onGameBoardPosted: function (gameId, status) {
		if (this.status == "started") {

		}
	},

	postShoot: function (game, x, y, robot) {
		var url = this.server + "games/" + game.getId() + "/shots?token=" + this.token;
		var shot = {x: String.fromCharCode(97 + x), y: y + 1};
		var self = this;
		$.post(url, shot)
			.done(function (data) {
				self.onShootPosted(game, data, robot);
			});
	},

	onShootPosted: function (game, state, robot) {
		switch (state) {
			case "SPLASH":
				this.onShootSound('splash', 'splash', robot);
				break;
			case "BOOM":
				this.onShootSound('explosion', 'boom', robot);
				break;
			default:
				this.onShootSound('', 'could not shoot', robot);
				break;
		}

		if (this.currentView == this.gameView) {
			this.gameView.onShootPosted(game, state);
		}

	},

	showError: function (text, delay) {
		$('#error-text').text(this.languages.getWord(text));
		$('#error').slideToggle(500).delay(delay).slideToggle(500);
	},

	onShootSound: function (state, message, robot) {
		if (state.length > 1) {
			var element = document.querySelector('#' + state);
			element.pause();
			element.currentTime = 0;
			element.play();
		}
		if (!robot) {
			$('#hit-message').text(this.languages.getWord(message));
			$('#hit-notification').slideToggle(250).delay(1500).slideToggle(150);
		}
	},

	onShipsReceived: function (ships) {
		// update board view with ships
		console.log("ships received");

		if (this.currentView == this.setupBoardView) {
			this.setupBoardView.onShipsReceived(ships);
		}
	},

	onGameListReceived: function (gameList) {
		// update views..
		if (this.currentView == this.listView) {
			this.listView.onGameListReceived(gameList);
		}
	},

	onGameReceived: function (game) {
		console.log("id: " + game.getId() + ", status: " + game.getStatus() + ", your turn: " + game.isYourTurn() + ", enemyId: " + game.getEnemyId() + ", enemyName: " + game.getEnemyName());
	},

	onNewGameCreated: function (data) {
		// update views, check what happened
		if (this.currentView == this.listView) {
			this.listView.onGameCreated(data);
		}
	},

	onGameUpdate: function (gameId) {
		console.log('on game update: ' + gameId);
		if(gameId) {
			if(this.currentView == this.gameView && this.gameView.gameId && this.gameView.gameId == gameId) {
				this.gameView.updateGame();
			}
		}
	},

	removeGames: function (data) {
		var self = this;
		var url = this.server + "users/me/games?token=" + this.token;

		$.ajax({
			url: url,
			type: 'DELETE',
			success: function (result) {
				if (self.currentView == self.listView) {
					self.listView.onGamesRemoved();
				}
			}
		});
	},

	reloadLanguages: function() {
		this.languages = new Languages();
	},

	switchView: function (view, obj) {
		var self = this;
		if (this.currentView) {
			this.currentView.destruct();
		}
		switch (view) {
			case "setupboard":
				$.get('assets/views/setupboard.html', function (data) {
					$('#view').html(data);
					self.currentView = self.setupBoardView;
					self.setupBoardView.init(obj);
				});
				break;
			case "list":
				$.get('assets/views/gamelist.html', function (data) {
					$('#view').html(data);
					self.currentView = self.listView;
					self.listView.init();
				});
				break;
			case "game":
				$.get('assets/views/gameboard.html', function (data) {
					$('#view').html(data);
					self.currentView = self.gameView;
					self.gameView.init(obj);
				});
				break;
		}
	}
}
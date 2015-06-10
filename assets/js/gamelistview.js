function GameListView(app) {
	this.app = app;
}

GameListView.prototype = {
	init: function () {
		$('#gamelist').hide();

		this.app.requestGameList();

		this.bindListeners();
		this.listen();
	},

	destruct: function () {
		clearInterval(this.listener);
		$(window).off();
	},

	listen: function () {
		var self = this;
		this.listener = setInterval(function () {
			self.app.requestGameList()
		}, 2000);
	},

	bindListeners: function () {
		$('#newgame').click($.proxy(this.onNewGameClick, this));
		$('#newgameai').click($.proxy(this.onNewGameAIClick, this));
		$('#removegames').click($.proxy(this.onRemoveGamesClick, this));
	},

	onNewGameClick: function (event) {
		this.app.requestNewGame();
	},

	onNewGameAIClick: function (event) {
		this.app.requestNewGame(true);
	},

	onRemoveGamesClick: function (event) {
		this.app.removeGames();
	},

	onGamesRemoved: function () {
		alert("De gamelijst is leeggemaakt");
		this.app.requestGameList();
	},

	onGameCreated: function (game) {
		if (game.msg && game.msg.indexOf('Error') == 0) {
			alert("Er is al een game aangemaakt.");
			return;
		}

		this.app.requestGameList();
	},

	onNavigateClick: function (event) {
		var elem = $(event.delegateTarget);
		var id = elem.data('id');
		var self = this;

		// request status of game
		this.app.requestGame(id, function (game) {
			if (game) {
				switch (game.getStatus()) {
					case "setup":
						self.app.switchView('setupboard', id);
						break;
					case "done":
					case "started":
						self.app.switchView('game', id);
						break;
				}
			}
		});
	},

	onGameListReceived: function (gameList) {
		console.log('gamelist received');

		var table = $('#gamelist');
		table.empty();

		var allGames = gameList.getGames();

		if (gameList.getStartedGames().length != 0) table.append('<tr><th></th><th>Started Games</th><th></th></tr>');
		for (var a = 0; a < gameList.getStartedGames().length; a++) {
			var row = $('<tr></tr>');
			var games = gameList.getStartedGames();
			var game = games[a];
			row.append('<td>' + game.getStatus() + '</td>');
			row.append('<td>' + game.getEnemyName() + '</td>');
			row.append('<td><button class="navigate-game" data-id=' + game.getId() + ' data-state="' + game.getStatus() + '">Go</button></td>');
			table.append(row);
		}

		if (gameList.getSetupGames().length != 0) table.append('<tr><th></th><th>Setup Games</th><th></th></tr>');
		for (var b = 0; b < gameList.getSetupGames().length; b++) {
			var row = $('<tr></tr>');
			var games = gameList.getSetupGames();
			var game = games[b];
			row.append('<td>' + game.getStatus() + '</td>');
			row.append('<td>' + game.getEnemyName() + '</td>');
			row.append('<td><button class="navigate-game" data-id=' + game.getId() + ' data-state="' + game.getStatus() + '">Go</button></td>');
			table.append(row);
		}

		if (gameList.getQueueGames().length != 0) table.append('<tr><th></th><th>Que Games</th><th></th></tr>');
		for (var c = 0; c < gameList.getQueueGames().length; c++) {
			var row = $('<tr></tr>');
			var games = gameList.getQueueGames();
			var game = games[c];
			row.append('<td>' + game.getStatus() + '</td>');
			row.append('<td>' + game.getEnemyName() + '</td>');
			row.append('<td><button class="navigate-game" data-id=' + game.getId() + ' data-state="' + game.getStatus() + '">Go</button></td>');
			table.append(row);
		}

		if (gameList.getDoneGames().length != 0) table.append('<tr><th></th><th>Done Games</th><th></th></tr>');
		for (var d = 0; d < gameList.getDoneGames().length; d++) {
			var row = $('<tr></tr>');
			var games = gameList.getDoneGames();
			var game = games[d];
			row.append('<td>' + game.getStatus() + '</td>');
			row.append('<td>' + game.getEnemyName() + '</td>');
			row.append('<td><button class="navigate-game" data-id=' + game.getId() + ' data-state="' + game.getStatus() + '">Go</button></td>');
			table.append(row);
		}

		
		$('.navigate-game').click($.proxy(this.onNavigateClick, this));

		table.show();
	}
}
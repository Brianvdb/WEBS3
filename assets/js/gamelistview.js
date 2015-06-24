function GameListView(app) {
	this.app = app;
	window.setInterval(function() {
		var quotes = app.languages.getTranslation('quotes');
		$('.flip-container').toggleClass('hover');
		if ($('#notification[style*="display:none"]')) {
			var random = Math.floor(Math.random() * quotes.length);
			$('#message').text(quotes[random]);
			$('#notification').slideToggle(500).delay(3500).slideToggle(500);
		}
	}, 15000);
}

GameListView.prototype = {
	init: function () {
		$('#gamelist').hide();
		$('#createdpanel').hide();
		$('#languagepanel').hide();

		this.app.requestGameList();

		this.bindListeners();
		this.listen();

		this.app.languages.translate();
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
		$("#dutch").click($.proxy(this.onDutchLanguageClick, this));
		$("#english").click($.proxy(this.onEnglishLanguageClick, this));
		$("#german").click($.proxy(this.onGermanLanguageClick, this));
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

	onDutchLanguageClick: function (event) {
		this.app.languages.setLanguageCookie('dutch');
		this.app.reloadLanguages();
		this.app.switchView('list');
	},

	onEnglishLanguageClick: function (event) {
		this.app.languages.setLanguageCookie('english');
		this.app.reloadLanguages();
		this.app.switchView('list');
	},

	onGermanLanguageClick: function (event) {
		this.app.languages.setLanguageCookie('german');
		this.app.reloadLanguages();
		this.app.switchView('list');
	},

	onGamesRemoved: function () {
		this.app.showError('gamelist empty', 1500);
		this.app.requestGameList();
	},

	onGameCreated: function (game) {
		if (game.msg && game.msg.indexOf('Error') == 0) {
			this.app.showError('game has been created already', 1500);
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
		var table = $('#gamelist');
		table.empty();

		var allGames = gameList.getGames();

		if (gameList.getStartedGames().length != 0) table.append('<tr><th class="center"><h4>' + this.app.languages.getTranslation('started games') + '</h4></th></tr>');
		for (var a = 0; a < gameList.getStartedGames().length; a++) {
			var row = $('<tr></tr>');
			var games = gameList.getStartedGames();
			var game = games[a];
			row.append('<td><button class="navigate-game" data-id=' + game.getId() + ' data-state="' + game.getStatus() + '">' + game.getEnemyName() + '<span class="glyphicon glyphicon-menu-right pull-right" aria-hidden="true"></span></button></td>');
			table.append(row);
		}

		if (gameList.getSetupGames().length != 0) table.append('<tr><th class="center"><h4>' + this.app.languages.getTranslation('setup games') + '</h4></th></tr>');
		for (var b = 0; b < gameList.getSetupGames().length; b++) {
			var row = $('<tr></tr>');
			var games = gameList.getSetupGames();
			var game = games[b];
			row.append('<td><button class="navigate-game" data-id=' + game.getId() + ' data-state="' + game.getStatus() + '">' + game.getEnemyName() + '<span class="glyphicon glyphicon-menu-right pull-right" aria-hidden="true"></span></button></td>');
			table.append(row);
		}

		if (gameList.getQueueGames().length != 0) table.append('<tr><th class="center"><h4>' + this.app.languages.getTranslation('que games') + '</h4></th></tr>');
		for (var c = 0; c < gameList.getQueueGames().length; c++) {
			var row = $('<tr></tr>');
			var games = gameList.getQueueGames();
			var game = games[c];
			row.append('<td><button disabled class="navigate-game" data-id=' + game.getId() + ' data-state="' + game.getStatus() + '">' + this.app.languages.getTranslation('undefined') + '<span class="glyphicon glyphicon-menu-right pull-right" aria-hidden="true"></span></button></td>');
			table.append(row);
		}

		if (gameList.getDoneGames().length != 0) table.append('<tr><th class="center"><h4>' + this.app.languages.getTranslation('done games') + '</h4></th></tr>');
		for (var d = 0; d < gameList.getDoneGames().length; d++) {
			var row = $('<tr></tr>');
			var games = gameList.getDoneGames();
			var game = games[d];
			row.append('<td><button class="navigate-game" data-id=' + game.getId() + ' data-state="' + game.getStatus() + '">' + game.getEnemyName() + '<span class="glyphicon glyphicon-menu-right pull-right" aria-hidden="true"></span></button></td>');
			table.append(row);
		}

		$('.navigate-game').click($.proxy(this.onNavigateClick, this));

		table.slideDown();
		$('#createdpanel').slideDown();
		$('#languagepanel').slideDown();
		$('[data-toggle="tooltip"]').tooltip();
	}
}
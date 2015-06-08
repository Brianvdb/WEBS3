function GameBoardView(app) {
	this.app = app;
}

GameBoardView.prototype = {
	init: function (gameId) {
		this.gameId = gameId;
		this.myTurn = false;

		var self = this;
		this.app.requestGame(gameId, function (game) {
			self.onGameReceived(game)
		});

		for (var i = 0; i < 100; i++) {
			$('#grid1').append('<div data-targetIndex="' + i + '"><div></div></div>');
			$('#grid2').append('<div class="clickable" data-targetIndex="' + i + '"><div></div></div>');
		}

		this.bindListeners();
	},

	destruct: function () {
		this.game = undefined;
		this.ships = undefined;
		$(window).off();
	},

	bindListeners: function () {
		$(window).scroll(this.updatePositions);
		$(window).resize(this.updatePositions);

		$('#goback').click($.proxy(this.onBackClick, this));
	},

	onBackClick: function (event) {
		this.app.switchView('list');
	},

	onGameReceived: function (game) {
		this.game = game;

		var ships = game.getMyBoard().getShips();
		var view = $('#view');
		var offset = view.offset().top;

		if (game.isYourTurn()) {
			this.myTurn = true;
			$('#turn').text("Your turn");
		} else {
			this.myTurn = false;
			$('#turn').text("Enemy's turn");
		}

		if (!this.ships) {
			this.ships = ships;
			for (var i = 0; i < ships.length; i++) {
				var ship = ships[i];
				var shipElem = $('<div class="box" data-ship="' + i + '" data-length="' + ship.getLength() + '"></div>');
				view.append(shipElem);
				// 2D index to 1D index
				var targetIndex = ship.getY() * 10 + ship.getX();
				var target = $("#grid1 [data-targetIndex='" + targetIndex + "']");

				var bgImg = "url(assets/images/ship" + ship.getLength() + ".png)";

				var width = 40;
				var height = 40;
				if (ship.isVertical()) {
					height = 40 * ship.getLength();
				} else {
					width = 40 * ship.getLength();
				}

				shipElem.
					css({
						top: target.offset().top - offset,
						left: target.offset().left,
						width: width,
						height: height,
						"background-image": bgImg,
						"background-size": 'cover'
					}).attr('data-index', targetIndex);

			}
		}

		// reset
		$('#grid2 div').removeClass('hit').removeClass('no-hit').off();

		// shot squares enemy board
		var shotSquares = game.getEnemyBoard().getShootSquares();
		for (var i = 0; i < shotSquares.length; i++) {
			var square = shotSquares[i];
			var targetIndex = square.getY() * 10 + square.getX();
			var target = $("#grid2 [data-targetIndex='" + targetIndex + "'] div");
			if (square.isHit()) {
				target.addClass('hit');
			} else {
				target.addClass('no-hit');
			}
		}

		// shot squares my board
		shotSquares = game.getMyBoard().getShootSquares();
		for (var i = 0; i < shotSquares.length; i++) {
			var square = shotSquares[i];
			var targetIndex = square.getY() * 10 + square.getX();
			var target = $("#grid1 [data-targetIndex='" + targetIndex + "'] div");
			if (square.isHit()) {
				target.addClass('hit');
			} else {
				target.addClass('no-hit');
			}
		}

		if (this.myTurn) {
			$('#grid2 .clickable').addClass('hit-hover').click($.proxy(this.onShoot, this));
		}
	},

	onShoot: function (event) {
		var index = $(event.delegateTarget).attr('data-targetIndex');
		var x = index % 10;
		var y = Math.floor(index / 10);

		if (this.myTurn) {
			this.app.postShoot(this.game, x, y);
			this.myTurn = false;
		}
	},

	onShootPosted: function (game, state) {
		if (game.getId() == this.game.getId()) {
			var self = this;
			this.app.requestGame(game.getId(), function (game) {
				self.onGameReceived(game)
			});
		}
	},

	updatePositions: function () {
		var offset = $('#view').offset().top;
		$('div[data-index]').each(function () {
			var target = $("#grid1 [data-targetIndex='" + $(this).attr('data-index') + "']");
			$(this).
				css({
					top: target.offset().top - offset,
					left: target.offset().left
				})
		});
	}

}
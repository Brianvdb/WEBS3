function GameBoardView(app) {
	this.app = app;
}

GameBoardView.prototype = {
	init: function (gameId) {
		this.gameId = gameId;
		this.myTurn = false;
		this.robot = false;

		this.updateGame();

		for (var i = 0; i < 100; i++) {
			$('#grid1').append('<div data-targetIndex="' + i + '"><div></div></div>');
			$('#grid2').append('<div class="clickable" data-targetIndex="' + i + '"><div></div></div>');
		}

		this.bindListeners();
		//this.listen();
		this.app.languages.translate();
	},
	
	listen: function () {
		var self = this;
		
		this.listener = setInterval(function () {
			self.app.requestGame(self.gameId, function (game) {
				
				self.onGameReceived(game)
			});
		}, 2000);
	},

	destruct: function () {
		this.game = undefined;
		this.ships = undefined;
		clearInterval(this.listener);
		$(window).off();
	},
	
	updateGame: function() {
		var self = this;
		this.app.requestGame(self.gameId, function (game) {
			self.onGameReceived(game)
		});
	},

	bindListeners: function () {
		$(window).scroll(this.updatePositions);
		$(window).resize(this.updatePositions);

		$('#goback').click($.proxy(this.onBackClick, this));
		$('#robot').click($.proxy(this.onRobotClick, this));
	},

	onBackClick: function (event) {
		this.app.switchView('list');
	},

	onRobotClick: function (event) {
		this.robot = !this.robot;
		if(this.robot) {
			console.log(this.app.languages.getWord('robot on'));
			$('#robot').text(this.app.languages.getWord('robot on'));

			if(this.game && this.myTurn) {
				this.makeMove();
			}

		} else {
			$('#robot').text(this.app.languages.getWord('robot off'));
		}
	},

	onGameReceived: function (game) {
		if(this.app.currentView != this) {
			console.log('RETURN!');
			return;
		}
		
		this.game = game;

		var ships = game.getMyBoard().getShips();
		var view = $('#view');
		var offset = view.offset().top;

		if (game.isYourTurn()) {
			this.myTurn = true;
			$('#turn').text(this.app.languages.getWord('your turn'));
		} else {
			this.myTurn = false;
			$('#turn').text(this.app.languages.getWord('enemy turn'));
		}

		if (!this.ships) {
			this.ships = ships;
			for (var i = 0; i < ships.length; i++) {
				var ship = ships[i];
				var shipElem = $('<div class="box" data-ship="' + i + '" data-length="' + ship.getLength() + '"></div>');
				if (ship.isVertical()) {
					shipElem.addClass('rotated');
				}
				view.append(shipElem);
				// 2D index to 1D index
				var targetIndex = ship.getY() * 10 + ship.getX();
				var target = $("#grid1 [data-targetIndex='" + targetIndex + "']");

				var bgImg = "url(assets/images/ships/ship" + ship.getLength() + ".png)";

				var width = 40;
				var height = 40;
				if (ship.isVertical()) {
					width = 40 * ship.getLength();
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

			if(this.robot) {
				this.makeMove();
			}
		}
	},

	makeMove: function() {
		var move = this.game.getEnemyBoard().aiMove();
		if (this.myTurn) {
			this.app.postShoot(this.game, move.x, move.y);
			this.myTurn = false;
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
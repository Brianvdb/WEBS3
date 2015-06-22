/**
 * Created by Gebruiker on 23-5-2015.
 */
function SetupBoardView(app) {
	this.app = app;
}

SetupBoardView.prototype = {
	init: function (gameId) {
		this.board = new Board(10);
		this.gameId = gameId;

		for (var i = 0; i < 100; i++) {
			$('#grid').append('<div data-targetIndex="' + i + '"></div>');
		}

		this.app.requestShips();

		this.app.languages.translate();
	},

	destruct: function () {
		$(window).off();
	},

	onShipsReceived: function (ships) {
		for (var i = 0; i < ships.length; i++) {
			var ship = ships[i];
			var offset = i * 50;
			var width = ship.getLength() * 50;
			$('#view').append('<div class="box" data-ship="' + i + '" data-length="' + ship.getLength() + '" style="background-image: url(assets/images/ships/ship' + ship.getLength() + '.png); background-size: cover; left: 100px; top:' + offset + 'px; width:' + width + 'px; height:50px;"></div>');
		}

		this.ships = ships;
		this.bindListeners();
	},

	bindListeners: function () {
		var self = this;
		var board = this.board;
		var ships = this.ships;

		$('.box').draggable({
			cursorAt: {top: 24, left: 10},
			start: function (event, ui) {
				$(this).attr('dragging', '1');
			},
			stop: function (event, ui) {
				if ($(this).attr('dragging')) {
					var elem = $(this);
					elem.css({
						top: elem.attr('data-ship') * 50 + 'px',
						left: '100px'
					}).removeAttr('data-index');

					elem.removeClass('rotated');

					var ship = ships[$(this).attr('data-ship')];
					board.removeShip(ship);
				}
			},
			drag: function(event, ui) {
				window.onkeydown = function(e) {
					if(e.keyCode == 32 && e.target == document.body) {
						e.preventDefault();
						var attr = $(event.target).attr('dragging');
						if (typeof attr !== typeof undefined && attr !== false) {
							$(event.target).toggleClass('rotated');
						}
					}
				};
			}
		});

		$('div', '#grid').each(function () {
			var $div = $(this);
			$div.droppable({
				tolerance: "pointer",
				hoverClass: "hovergrid",
				drop: function (event, ui) {
					var x = $div.attr('data-targetIndex') % 10;
					var y = Math.floor($div.attr('data-targetIndex') / 10);
					var ship = ships[ui.draggable.attr('data-ship')];

					self.onShipPlace(x, y, ship, ui.draggable, $div);
				}
			});
		});

		$('#goback').click($.proxy(this.onBackClick, this));
		$('#sendboard').click($.proxy(this.onSendBoardClick, this));
		$('#randomboard').click($.proxy(this.onRandomBoardClick, this));
		$('#removeships').click($.proxy(this.onRemoveShipsClick, this));

		$(window).scroll(this.updatePositions);
		$(window).resize(this.updatePositions);
	},

	onShipPlace: function(x, y, ship, shipElement, gridElement) {
		var board = this.board;
		var offset = $('#view').offset().top;

		board.removeShip(ship);
		if (shipElement.hasClass('rotated')) {
			ship.setVertical(true);
		}
		if (board.canPlace(ship, x, y, !ship.isVertical())) {
			board.addShip(ship, x, y, !ship.isVertical());
			shipElement.
				css({
					top: gridElement.offset().top - offset,
					left: gridElement.offset().left
				}).attr('data-index', gridElement.attr('data-targetIndex'))
				.attr('data-top', gridElement.offset().top - offset)
				.removeAttr('dragging');
		}
	},

	onRandomBoardClick: function (event) {
		if (!this.ships) {
			this.app.showError('ships not loaded', 1500);
			return;
		}

		var board = this.board;

		for (var i = 0; i < this.ships.length; i++) {
			var ship = this.ships[i];
			var shipElement = $("[data-ship=" + i + "]");
			var vertical = this.randomInt(2) == 0;
			if(vertical) {
				shipElement.addClass('rotated');
				while(true) {
					var x = this.randomInt(board.getSize());
					var y = this.randomInt(board.getSize() - ship.getLength());
					if (board.canPlace(ship, x, y, false)) {
						var targetIndex = y * 10 + x;
						var target = $("[data-targetIndex='" + targetIndex + "']");
						this.onShipPlace(x, y, ship, shipElement, target);
						break;
					}
				}
			} else {
				shipElement.removeClass('rotated');
				while(true) {
					var x = this.randomInt(board.getSize() - ship.getLength());
					var y = this.randomInt(board.getSize());
					if (board.canPlace(ship, x, y, true)) {
						var targetIndex = y * 10 + x;
						var target = $("[data-targetIndex='" + targetIndex + "']");
						this.onShipPlace(x, y, ship, shipElement, target);
						break;
					}
				}
			}
		}
	},

	onRemoveShipsClick: function (event) {
		var board = this.board;
		for (var i = 0; i < this.ships.length; i++) {
			var ship = this.ships[i];
			var elem = $('[data-ship=' + ship.getId() + ']');
			elem.css({
				top: elem.attr('data-ship') * 50 + 'px',
				left: '100px'
			}).removeAttr('data-index').removeClass('rotated');
			board.removeShip(ship);
		}
	},

	randomInt: function (maxValue) {
		return Math.floor(Math.random() * maxValue);
	},

	onSendBoardClick: function (event) {
		if (!this.ships) {
			this.app.showError('ships not loaded', 1500);
			return;
		}

		for (var i = 0; i < this.ships.length; i++) {
			var ship = this.ships[i];
			if ($('[data-ship=' + ship.getId() + ']').hasClass('rotated')) {
				ship.setVertical(true);
			} else {
				ship.setVertical(false);
			}
			if (!ship.isPlaced()) {
				this.app.showError('place all ships on board', 1500);
				return;
			}
		}

		this.app.postGameBoard(this.gameId, this.ships);
	},

	onBackClick: function (event) {
		this.app.switchView('list');
	},

	checkCollision: function (event) {
		var targetSpot = event.target.getAttribute("data-targetIndex");
		var lastPos = 10 - event.toElement.getAttribute('data-length');
		var verticalPos = parseInt(targetSpot.substr(targetSpot.length - 1));
/*
		if (verticalPos > lastPos) {
			return false;
		}
*/
		return true;
	},

	updatePositions: function () {
		var offset = $('#view').offset().top
		$('div[data-index]').each(function () {
			var target = $("[data-targetIndex='" + $(this).attr('data-index') + "']");
			$(this).
				css({
					top: target.offset().top - offset,
					left: target.offset().left
				})
		});
	}

}
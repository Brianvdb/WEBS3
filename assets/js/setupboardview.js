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
			var width = ship.getLength() * 48;
			$('#view').append('<div class="box" data-ship="' + i + '" data-length="' + ship.getLength() + '" style="background-image: url(assets/images/ships/ship' + ship.getLength() + '.png); left: 100px; top:' + offset + 'px; width:' + width + 'px; height:48px;"></div>');
		}

		this.ships = ships;
		this.bindListeners();
	},

	bindListeners: function () {
		var self = this;
		var offset = $('#view').offset().top;
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
						$(event.target).toggleClass('rotated');
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
					self.dropEvent = event;
					var x = $div.attr('data-targetIndex') % 10;
					var y = Math.floor($div.attr('data-targetIndex') / 10);
					var ship = ships[ui.draggable.attr('data-ship')];
					board.removeShip(ship);
					if (ui.draggable.hasClass('rotated')) {
						ship.setVertical(true);
					}
					if (board.canPlace(ship, x, y, !ship.isVertical())) {
						board.addShip(ship, x, y, !ship.isVertical());
						ui.draggable.
							css({
								top: $div.offset().top - offset,
								left: $div.offset().left
							}).attr('data-index', $div.attr('data-targetIndex'))
							.attr('data-top', $div.offset().top - offset)
							.removeAttr('dragging');
					} else {
						// Do nothing..
					}
				}
			});
		});

		$('#goback').click($.proxy(this.onBackClick, this));
		$('#sendboard').click($.proxy(this.onSendBoardClick, this));

		$(window).scroll(this.updatePositions);
		$(window).resize(this.updatePositions);
	},

	onSendBoardClick: function (event) {
		if (!this.ships) {
			alert("Ships are not loaded yet...");
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
				alert("Place all ships on the board");
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
function Board(size, squares) {
	this.size = size;

	// if squares are given, set it. Otherwise make them.
	if (typeof squares !== 'undefined') {
		this.squares = squares;
	} else {
		this.squares = [];

		for (var i = 0; i < size; i++) {
			this.squares[i] = [];
			for (var j = 0; j < size; j++) {
				this.squares[i][j] = new Square(i, j);
			}
		}
	}
}

Board.prototype = {

	addShip: function (ship, startX, startY, isHorizontal) {
		if (isHorizontal) {
			for (var x = startX; x < startX + ship.getLength(); x++) {
				this.squares[x][startY].placeShip(ship);
			}
		} else {
			for (var y = startY; y < startY + ship.getLength(); y++) {
				this.squares[startX][y].placeShip(ship);
			}
		}

		ship.setStartCell(startX, startY);
		ship.setVertical(!isHorizontal);

		return true;
	},

	canPlace: function (ship, startX, startY, isHorizontal) {
		if (isHorizontal) {
			for (var x = startX; x < startX + ship.getLength(); x++) {
				if (x > 9) {
					return;
				}
				if (this.squares[x][startY].hasShip()) {
					return false;
				}
			}
		} else {
			for (var y = startY; y < startY + ship.getLength(); y++) {
				if (y > 9) {
					return;
				}
				if (this.squares[startX][y].hasShip()) {
					return false;
				}
			}
		}
		return true;
	},

	removeShip: function (ship) {
		for (var i = 0; i < this.size; i++) {
			for (var j = 0; j < this.size; j++) {
				if (this.squares[i][j].getShip() == ship) {
					this.squares[i][j].removeShip();
				}
			}
		}
		ship.reset();
	},

	getShips: function () {
		var ships = [];
		for (var i = 0; i < this.size; i++) {
			for (var j = 0; j < this.size; j++) {
				var square = this.squares[i][j];
				if (square.hasShip() && ships.indexOf(square.getShip()) == -1) {
					ships.push(square.getShip());
				}
			}
		}
		return ships;
	},

	getShootSquares: function () {
		var squares = [];
		for (var i = 0; i < this.size; i++) {
			for (var j = 0; j < this.size; j++) {
				var square = this.squares[i][j];
				if (square.hasBeenShot()) {
					squares.push(square);
				}
			}
		}
		return squares;
	},

	getSize: function () {
		return this.size;
	},

	aiMove: function() {
		// simple AI

		//// check hits
		for (var x = 0; x < this.size; x++) {
			for (var y = 0; y < this.size; y++) {
				if(this.squares[x][y].isHit()) {

				}
			}
		}

		//// pick random move

		while(true) {
			var x = Math.floor(Math.random() * 10);
			var y = Math.floor(Math.random() * 10);
			if(!this.squares[x][y].hasBeenShot()) {
				return { x: x, y: y };
			}
		}

	},

	getSurroundInfo: function(x, y) {
		// left
		var leftInBounds = this.inBounds(x - 1, y), leftShot = false, leftHit = false;
		if(leftInBounds) {
			leftShot = this.squares[x - 1][y].hasBeenShot();
			leftHit = this.squares[x - 1][y].isHit();
		}
		// right
		var rightInBounds = this.inBounds(x + 1, y), rightShot = false, rightHit = false;
		if(rightInBounds) {
			rightShot = this.squares[x + 1][y].hasBeenShot();
			rightHit = this.squares[x + 1][y].isHit();
		}
		// up
		var upInBounds = this.inBounds(x , y - 1), upShot = false, upHit = false;
		if(upInBounds) {
			upShot = this.squares[x ][y - 1].hasBeenShot();
			upHit = this.squares[x ][y - 1].isHit();
		}
		// down
		var downInBounds = this.inBounds(x , y + 1), upShot = false, upHit = false;
		if(downInBounds) {
			upShot = this.squares[x ][y + 1].hasBeenShot();
			upHit = this.squares[x ][y + 1].isHit();
		}
	},

	inBounds: function(x, y) {
		return x >= 0 && x < 10 && y >= 0 && y < 10;
	},

	hit: function (x, y, hit) {
		if (this.inBounds(x, y)) {
			if(this.squares[x][y]) {
				this.squares[x][y].shoot();
				if (hit) {
					this.squares[x][y].hit();
				}
			}
		}
	}

}


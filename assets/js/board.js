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
					var info = this.getInfo(x, y, this);
					if(info.west().hit || info.east().hit) {
						if(info.west().inBounds && !info.west().shot) {
							return info.west();
						}
						if(info.east().inBounds && !info.east().shot) {
							return info.east();
						}
					} else if(info.north().hit || info.south().hit) {
						if(info.north().inBounds && !info.north().shot) {
							return info.north();
						}
						if(info.south().inBounds && !info.south().shot) {
							return info.south();
						}
					} else {
						if (info.west().inBounds && !info.west().shot) {
							return info.west();
						}
						if (info.east().inBounds && !info.east().shot) {
							return info.east();
						}
						if (info.north().inBounds && !info.north().shot) {
							return info.north();
						}
						if (info.south().inBounds && !info.south().shot) {
							return info.south();
						}
					}
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

	getInfo: function(x, y, instance) {
		var inBounds = this.inBounds(x, y), shot = false, hit = false;
		if(inBounds) {
			shot = this.squares[x][y].hasBeenShot();
			hit = this.squares[x][y].isHit();
		}

		return {
			x: x,
			y: y,
			inBounds: inBounds,
			shot: shot,
			hit: hit,
			west: function() { return instance.getInfo(x - 1, y, instance); },
			east: function() { return instance.getInfo(x + 1, y, instance); },
			north: function() { return instance.getInfo(x, y - 1, instance); },
			south: function() { return instance.getInfo(x, y + 1, instance); },
			northwest: function() { return instance.getInfo(x - 1, y - 1, instance); },
			northeast: function() { return instance.getInfo(x + 1, y - 1, instance); },
			southwest: function() { return instance.getInfo(x - 1, y + 1, instance); },
			southeast: function() { return instance.getInfo(x + 1, y + 1, instance); }
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


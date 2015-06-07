function Board(size, squares) {
	this.size = size;
	
	// if squares are given, set it. Otherwise make them.
	if(typeof squares !== 'undefined') {
		this.squares = squares;
	} else {
		this.squares = [];
		
		for(var i = 0; i < size; i++) {
			this.squares[i] = [];
			for(var j = 0; j < size; j++) {
				this.squares[i][j] = new Square(i, j);
			}
		}
	}
}

Board.prototype = {

	addShip: function(ship, startX, startY, isHorizontal) {
		// TODO: implement check whether given ship can be placed on the board
        if(isHorizontal) {
            for(var x = startX; x < startX + ship.getLength(); x++) {
                console.log("taken: " + x + "," + startY + " : " + ship.getLength());
                this.squares[x][startY].placeShip(ship);
            }
        } else {
            for(var y = startY; y <= startY + ship.getLength(); y++) {
                this.squares[startX][y].placeShip(ship);
            }
        }

		return true;
	},

    canPlace: function(ship, startX, startY, isHorizontal) {
        if (isHorizontal) {
            for (var x = startX; x < startX + ship.getLength(); x++) {
                console.log("check taken: " + x + "," + startY + " : " + ship.getLength());
                if (this.squares[x][startY].hasShip()) {
                    return false;
                }
            }
        } else {
            for (var y = startY; y < startY + ship.getLength(); y++) {
                if (this.squares[startX][y].hasShip()) {
                    return false;
                }
            }
        }
        return true;
    },

    removeShip: function(ship) {
        for(var i = 0; i < this.size; i++) {
            for(var j = 0; j < this.size; j++) {
                if(this.squares[i][j].getShip() == ship) {
                    this.squares[i][j].removeShip();
                }
            }
        }
    }
}


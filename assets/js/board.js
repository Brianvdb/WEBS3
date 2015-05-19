var Board = function(size, squares) {
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
	render: function() {
		var grid = $('#grid');
		for (var i = 0; i < this.size; i++) {
			row = "<tr>";
			for (var j = 0; j < this.size; j++) {
				row += "<td class='location' data-x='" + i + "' data-y='" + j + "'></td>";
			}
			row += "</tr>";
			grid.append(row);
		}
		
		this.bindListeners();
	},
	
	onClick: function(event) {
		// fetch grid position
		var x = $(event.target).data('x');
		var y = $(event.target).data('y');
		
		// determine if this cell has already been shot
		if(this.squares[x][y].hasBeenShot()) {
			return;
		}
		
		// show alert on screen
		//alert( "X: " + x + ", Y: " + y );
		console.log( "X: " + x + ", Y: " + y);
		
		// change backgroundColor
		$(event.target).css('background-color', '#ffff00');
		
		// update shootPositions
		this.squares[x][y].shoot();
	},
	
	bindListeners: function() {
		$('td').click( $.proxy(this.onClick, this) );
	}
}


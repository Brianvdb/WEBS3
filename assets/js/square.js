function Square(x, y) {
	this.x = x;
	this.y = y;
	this.shot = false;
	this.taken = false;
	this.wasHit = false;
}

Square.prototype = {
	getX: function () {
		return this.x;
	},

	getY: function () {
		return this.y;
	},

	placeShip: function (ship) {
		this.taken = true;
		this.ship = ship;
	},

	hasShip: function () {
		return this.ship != null;
	},

	getShip: function () {
		return this.ship;
	},

	shoot: function () {
		this.shot = true;
		this.wasHit = this.hasShip();
	},

	hasBeenShot: function () {
		return this.shot;
	},

	hit: function () {
		this.wasHit = true;
	},

	isHit: function () {
		return this.shot && this.wasHit;
	},

	removeShip: function () {
		this.ship = undefined;
	}
}
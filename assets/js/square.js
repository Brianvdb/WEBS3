var Square = function(x, y) {
	this.x = x;
	this.y = y;
	this.shot = false;
}

Square.prototype = {
	getX: function() { return this.x },
	getY: function() { return this.y },
	shoot: function() { this.shot = true; },
	hasBeenShot: function() { return this.shot; }
}
function Ship(id, length, name, __v) {
	this.id = id;
	this.length = length;
	this.name = name;
    this.v = __v;

}

Ship.prototype = {
	setStartCell: function(x, y) {
        this.x = x;
        this.y = y;
    },

	setVertical: function(isVertical) {
        this.vertical = isVertical;
    },

	getId: function() {
        return this.id;
    },

	getLength: function() {
        return this.length;
    },

	getName: function() {
        return this.name;
    },

	getStartCell: function() {
        return {
            "x": String.fromCharCode(97 + this.x),
            "y": this.y + 1
        };
    },

    getX: function() {
        return this.x;
    },

    getY: function() {
        return this.y;
    },

    isPlaced: function() {
        return typeof this.x != 'undefined' && typeof this.y != 'undefined';
    },

    reset: function() {
        this.vertical = undefined;
        this.x = undefined;
        this.y = undefined;
    },

	isVertical: function() {
        return this.vertical;
    },

    getV: function() {
        return this.v;
    }
}
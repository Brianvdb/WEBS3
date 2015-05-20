function Ship(id, length, name, x, y, isVertical) {
    this.id = id;
    this.length = length;
    this.name = name;
    this.x = x;
    this.y = y;
    this.isVertical = isVertical;
}

Ship.prototype = {
    setX: function(x) { this.x = x },
    setY: function(y) { this.y = y },
    setVertical: function(isVertical) { this.isVertical = isVertical },
    getId: function() { return this.id },
    getLength: function() { return this.length },
    getName: function() { return this.name },
    getX: function() { return this.x },
    getY: function() { return this.y },
    isVertical: function() { return this.isVertical }
}
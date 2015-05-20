function Ship(id, length, name) {
    this.id = id;
    this.length = length;
    this.name = name;
}

Ship.prototype = {
    getId: function() { return this.id; },
    getLength: function() { return this.length; },
    getName: function() { return this.name; }
}
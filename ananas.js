ROT = require('rot-js');
var Game = {
    display: null,
    init: function() {
        this.display = new ROT.Display();
        document.body.appendChild(this.display.getContainer());
        this._generateMap();
        var scheduler = new ROT.Scheduler.Simple();
        scheduler.add(this.player, true);
        scheduler.add(this.pedro, true);
        this.engine = new ROT.Engine(scheduler);
        this.engine.start();
    }
};
Game.map = {};
Game._generateMap = function() {
    var digger = new ROT.Map.Digger();
    var freeCells = [];

    var digCallback = function(x, y, value) {
        if (value) { return; } /* do not store walls */
        var key = x + "," + y;
        freeCells.push(key);
        this.map[key] = ".";
    };
    digger.create(digCallback.bind(this));
    this._generateBoxes(freeCells);
    this._drawWholeMap();
    this.player = this._createBeing(Player, freeCells);
    this.pedro = this._createBeing(Pedro, freeCells);
};
Game._createBeing = function(what, freeCells) {
    var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
    var key = freeCells.splice(index, 1)[0];
    var parts = key.split(",");
    var x = parseInt(parts[0]);
    var y = parseInt(parts[1]);
    return new what(x, y);
};
Game._drawWholeMap = function() {
    for (var key in this.map) {
        var parts = key.split(",");
        var x = parseInt(parts[0]);
        var y = parseInt(parts[1]);
        this.display.draw(x, y, this.map[key]);
    }
};
Game.ananas = null;
Game._generateBoxes = function(freeCells) {
    for (var i = 0; i < 10; i++) {
        var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
        var key = freeCells.splice(index, 1)[0];
        this.map[key] = "*";
        if (!i) this.ananas = key;
    }
};
var Player = function(x, y) {
    this._x = x;
    this._y = y;
    this._draw();
}
Player.prototype._draw = function() {
    Game.display.draw(this._x, this._y, "@", "#ff0");
};
var Pedro = function(x, y) {
    this._x = x;
    this._y = y;
    this._draw();
};
Pedro.prototype._draw = function() {
    Game.display.draw(this._x, this._y, "P", "red");
};
Pedro.prototype.act = function() {
    var x = Game.player.getX();
    var y = Game.player.getY();
    var passableCallback = function(x, y) {
        return (x+","+y in Game.map);
    };
    var astar = new ROT.Path.AStar(x, y, passableCallback, {topology:4});
    var path = [];
    var pathCallback = function(x, y) {
        path.push([x,y]);
    }
    astar.compute(this._x, this._y, pathCallback);

    path.shift(); // remove Pedro's position
    if (path.length == 1) {
        Game.engine.lock();
        alert("Pedro captured you. Game over.");
    } else {
        x = path[0][0];
        y = path[0][1];
        Game.display.draw(this._x, this._y, Game.map[this._x+","+this._y]);
        this._x = x;
        this._y = y;
        this._draw();
    }
};

Game.player = null;
Game.engine = null;
Player.prototype.act = function() {
    Game.engine.lock();
    window.addEventListener("keydown", this);
};
Player.prototype.getX = function() { return this._x; };
Player.prototype.getY = function() { return this._y; };

Player.prototype.handleEvent = function(e) {
    /* process user input */
    var keyMap = {
        "38": 0,
        "33": 1,
        "39": 2,
        "34": 3,
        "40": 4,
        "35": 5,
        "37": 6,
        "36": 7,
    };
    var code = e.keyCode;
    if (code == 13 || code == 32) {
        this._checkBox();
        return;
    }
    if (!(code in keyMap)) {return;}
    var diff = ROT.DIRS[8][keyMap[code]];
    var newX = this._x + diff[0];
    var newY = this._y + diff[1];
    var newKey = newX + "," + newY;
    if (!(newKey in Game.map)) {return;}

    Game.display.draw(this._x, this._y, Game.map[this._x+","+this._y]);
    this._x = newX;
    this._y = newY;
    this._draw();
    window.removeEventListener("keydown", this);
    Game.engine.unlock();
};
Player.prototype._checkBox = function() {
    var key = this._x + "," + this._y;
    if (Game.map[key] != "*") {
        alert("This is no box here!");
    } else if (key == Game.ananas) {
        alert("You found the ananas and won this game!");
        Game.engine.lock();
        window.removeEventListener("keydown", this);
    } else {
        alert("This box is empty.");
    }
};
window.onload = function() { Game.init(); };

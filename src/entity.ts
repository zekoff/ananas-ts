import { DIRS, Path } from 'rot-js';
import * as util from './util';

export class Entity {
    constructor(
        private renderCharacter: string,
        private renderColor: string,
        protected game,
        public x: number,
        public y: number,
    ) {}
    draw() {
        this.game.display.draw(
            this.x,
            this.y,
            this.renderCharacter,
            this.renderColor
        );
    }
    act() {}
}
export class Player extends Entity {
    constructor(
        x: number,
        y: number,
        game,
    ) {
        super("@", "yellow", game, x, y);
    }
    act() {
        this.game.engine.lock();
        window.addEventListener('keydown', this);
    }
    handleEvent(e) {
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
            this.checkBox();
            return;
        }
        if (!(code in keyMap)) {return;}
        var diff = DIRS[8][keyMap[code]];
        var newX = this.x + diff[0];
        var newY = this.y + diff[1];
        var newKey = newX + "," + newY;
        if (!(newKey in this.game.map)) {return;}
    
        this.game.display.draw(
            this.x,
            this.y,
            this.game.map[util.packCell(this.x, this.y)]
        );
        this.x = newX;
        this.y = newY;
        this.draw();
        window.removeEventListener("keydown", this);
        this.game.engine.unlock();
    }
    checkBox() {
        let packedCell = util.packCell(this.x, this.y);
        if (this.game.map[packedCell] != "*") {
            util.showMessage("There is no box here.");
        } else if (packedCell == this.game.ananas) {
            util.showMessage("You found the ananas and won this game!");
            this.game.engine.lock();
            window.removeEventListener('keydown', this);
        } else {
            util.showMessage("This box is empty.");
        }
    }
}
export class Pedro extends Entity {
    constructor(
        x: number,
        y: number,
        game,
    ) {
        super("P", "red", game, x, y);
    }
    act() {
        var playerX = this.game.player.x;
        var playerY = this.game.player.y;
        var passableCallback = function(x: number, y: number) {
            return (util.packCell(x, y) in this.game.map);
        };
        var astar = new Path.AStar(
            playerX,
            playerY,
            passableCallback.bind(this),
            {topology:4}
        );
        var path = [];
        var pathCallback = function(x, y) {
            path.push([x,y]);
        }
        astar.compute(this.x, this.y, pathCallback);
    
        path.shift(); // remove Pedro's position
        if (path.length == 1) {
            this.game.engine.lock();
            util.showMessage("Pedro captured you. Game over.");
        } else {
            let newX: number, newY: number;
            newX = path[0][0];
            newY = path[0][1];
            this.game.display.draw(
                this.x,
                this.y,
                this.game.map[util.packCell(this.x, this.y)]
            );
            this.x = newX;
            this.y = newY;
            this.draw();
        }
    }
}

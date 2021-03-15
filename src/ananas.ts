import { Display, Map, RNG, Engine } from 'rot-js';
import { Player, Pedro } from './entity';

function pickFreeCell(freeCells: string[]) {
    let index = Math.floor(RNG.getUniform() * freeCells.length);
    return freeCells.splice(index, 1)[0]; // remove cell from list
}

function packCell(x: number, y: number) {
    return `${x},${y}`;
}

function unpackCell(packedCell: string) {
    let parts = packedCell.split(',');
    return [parseInt(parts[0]), parseInt(parts[1])];
}

class Game {
    display: Display;
    map: Record<string, string> = {};
    ananas: string;
    init() {
        this.display = new Display();
        document.body.appendChild(this.display.getContainer());
        this.generateMap();
    }
    private generateMap() {
        const digger = new Map.Digger(80, 25);
        const freeCells: string[] = [];
        const digCallback = (x: number, y: number, value: string) => {
            if (value) { return; } // do not store walls
            let key = packCell(x, y);
            freeCells.push(key);
            this.map[key] = '.';
        }
        digger.create(digCallback.bind(this));
        this.generateBoxes(freeCells);
        this.drawWholeMap();
        let [ x, y ] = unpackCell(pickFreeCell(freeCells));
        let player = new Player(x, y, ()=>{}, this);
        player.draw();
        [ x, y ] = unpackCell(pickFreeCell(freeCells));
        let pedro = new Pedro(x, y, ()=>{}, this);
        pedro.draw();
    }
    private generateBoxes(freeCells: string[]) {
        for (var i = 0; i < 10; i++) {
            let packedCell = pickFreeCell(freeCells);
            this.map[packedCell] = '*';
            if (!i) this.ananas = packedCell;
        }
    }
    private drawWholeMap() {
        for (var key in this.map) {
            let [ x, y ] = unpackCell(key);
            this.display.draw(x, y, this.map[key], null, null);
        }
    }
}
let game = new Game();
window.onload = () => { game.init(); };

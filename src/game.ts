import { Display, Map, Engine, Scheduler } from 'rot-js';
import { Player, Pedro } from './entity';
import * as util from './util';

export class Game {
    display: Display;
    map: Record<string, string> = {};
    ananas: string;
    player: Player;
    pedro: Pedro;
    engine: Engine;
    init() {
        this.display = new Display({
            width: 50,
            height: 26,
            fontSize: 18,
            forceSquareRatio: true
        });
        document.body.appendChild(this.display.getContainer());
        this.generateMap();
        let scheduler = new Scheduler.Simple();
        scheduler.add(this.player, true);
        scheduler.add(this.pedro, true);
        this.engine = new Engine(scheduler);
        this.engine.start();
    }
    private generateMap() {
        const digger = new Map.Digger(50, 25);
        const freeCells: string[] = [];
        const digCallback = (x: number, y: number, value: string) => {
            if (value) { return; } // do not store walls
            let key = util.packCell(x, y);
            freeCells.push(key);
            this.map[key] = '.';
        }
        digger.create(digCallback.bind(this));
        this.generateBoxes(freeCells);
        this.drawWholeMap();
        this.createEntities(freeCells);
    }
    private createEntities(freeCells: string[]) {
        let [ x, y ] = util.unpackCell(util.pickFreeCell(freeCells));
        this.player = new Player(x, y, this);
        this.player.draw();
        [ x, y ] = util.unpackCell(util.pickFreeCell(freeCells));
        this.pedro = new Pedro(x, y, this);
        this.pedro.draw();
    }
    private generateBoxes(freeCells: string[]) {
        for (var i = 0; i < 10; i++) {
            let packedCell = util.pickFreeCell(freeCells);
            this.map[packedCell] = '*';
            if (!i) this.ananas = packedCell;
        }
    }
    private drawWholeMap() {
        for (var key in this.map) {
            let [ x, y ] = util.unpackCell(key);
            this.display.draw(x, y, this.map[key], null, null);
        }
    }
}

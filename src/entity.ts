export class Entity {
    constructor(
        private renderCharacter: string,
        private renderColor: string,
        private game,
        public x: number,
        public y: number,
        private actFunction: Function,
    ) {}
    draw() {
        this.game.display.draw(
            this.x,
            this.y,
            this.renderCharacter,
            this.renderColor
        );
    }
    act() {
        this.actFunction();
    }
}
export class Player extends Entity {
    constructor(
        x: number,
        y: number,
        actFunction: Function,
        game,
    ) {
        super("@", "yellow", game, x, y, actFunction);
    }
}
export class Pedro extends Entity {
    constructor(
        x: number,
        y: number,
        actFunction: Function,
        game,
    ) {
        super("P", "red", game, x, y, actFunction);
    }
}

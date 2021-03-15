import { RNG } from 'rot-js';

export function pickFreeCell(freeCells: string[]) {
    let index = Math.floor(RNG.getUniform() * freeCells.length);
    return freeCells.splice(index, 1)[0]; // remove cell from list
}

export function packCell(x: number, y: number) {
    return `${x},${y}`;
}

export function unpackCell(packedCell: string) {
    let parts = packedCell.split(',');
    return [parseInt(parts[0]), parseInt(parts[1])];
}

export function showMessage(message: string) {
    alert(message);
}

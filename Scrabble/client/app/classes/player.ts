import { Easel } from './easel';
import { Letter } from './letter';
export class Player {
    username: string;
    easel: Easel;
    score: number;
    socketId: string;

    constructor(username: string) {
        this.username = username;
        this.easel = new Easel();
    }

    initializeEasel(letters: Letter[]): void {
        this.easel.tiles = letters;
    }

}


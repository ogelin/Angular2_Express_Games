import { Easel } from './easel';
import { Letter } from './letter';

export class Player {
    username: string;
    easel: Easel;
    score: number;
    socketId: string;

    constructor(username: string, socketId?: string) {
        this.username = username;
        this.socketId = socketId;
        this.easel = new Easel();
        this.score = 0;
    }

    initializeEasel(letters: Letter[]): void {
        this.easel.tiles = letters;
    }

}

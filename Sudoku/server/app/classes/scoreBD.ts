export class ScoreBD {
    usernamePlayer: string;
    score: string;
    id: number;

    constructor(id: number, usernamePlayer: string, score: string, ) {
        this.id = id;
        this.usernamePlayer = usernamePlayer;
        this.score = score;

    }
}

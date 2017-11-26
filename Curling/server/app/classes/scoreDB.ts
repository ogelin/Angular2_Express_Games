export class ScoreDB {
    usernamePlayer: string;
    scoreHuman: number;
    scoreCPU: number;
    id: number;

    constructor(id: number, usernamePlayer: string, scoreHuman: number, scoreCPU: number) {
        this.id = id;
        this.usernamePlayer = usernamePlayer;
        this.scoreHuman = scoreHuman;
        this.scoreCPU = scoreCPU;
    }
}

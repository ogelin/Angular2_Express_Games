import { Player } from './player';
import { Bag } from './bag';
import { Grid } from './grid';
import { Timer } from './timer';
const uuidV1 = require('uuid/v1');


export class GameRoom {

    id: string;
    players: Player[];
    bag = new Bag();
    capacity: number;
    timer: Timer;
    grid: Grid;

    constructor(capacity: number) {
        this.capacity = capacity;
        this.players = new Array<Player>();
        this.id = uuidV1();
        this.grid = new Grid();
        this.timer = new Timer();
    }

    public setScorePlayer(score: number, username: string) {
        let player = this.findPlayerByUsername(username);
        player.score = score;
    }

    public findPlayerByUsername(username: string): Player {
        let tempPlayer: Player;
        this.players.forEach(player => {
            if (player.username === username) {
                tempPlayer = player;
            }
        });

        return tempPlayer;
    }

    /**
        * removePlayer
        */
    public removePlayer(username: string) {
        for (let index = 0; index < this.players.length; index++) {
            if (this.players[index].username === username) {
                //to do remove timer
                this.players.splice(index, 1);
            }
        }
    }

    public isFull(): boolean {
        return (this.players.length === this.capacity);
    }

    public playerExist(username: string): boolean {
        return (this.findPlayerByUsername(username) !== undefined);
    }

    /**
     * missingPlayer
     */
    public missingPlayer(): number {
        return this.capacity - this.players.length;
    }

    randomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    /**
     * randomIndex
     */
    public randomizePlayersList() {
        for (let index = 0; index < 100; index++) {
            let randomIndex1 = this.randomNumber(0, this.players.length - 1);
            let randomIndex2 = this.randomNumber(0, this.players.length - 1);

            let temp = this.players[randomIndex1];
            this.players[randomIndex1] = this.players[randomIndex2];
            this.players[randomIndex2] = temp;
        }
    }

    /**
     * invertRound
     */
    public invertRound() {
        let tempPlayer = this.players[0];

        for (let i = 0; i < this.players.length - 1; i++) {
            this.players[i] = this.players[i + 1];
        }

        this.players[this.players.length - 1] = tempPlayer;
    }

    public getPlayersUsernames(): Array<string> {
        let listPlayer = new Array<string>();

        for (let i = 0; i < this.players.length; i++) {
            listPlayer[i] = this.players[i].username;
        }

        return listPlayer;
    }

    public initTimer() {
        this.timer.initializeTimer();
    }

}

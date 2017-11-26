import { Injectable } from '@angular/core';
import { ScoreService } from '../services/score.service';
import { Player } from '../classes/player';
import { PlayerService } from '../services/player.service';
import { Level } from '../classes/level';

const enum SCENE {
    POS_Y = -15,
}

@Injectable()
export class EndGameService {
    private bestPlayerScore: any;
    private isbestPlayer = false;
    private player: Player;

    constructor(private scoreService: ScoreService, private playerService: PlayerService) {
        //todo
    }

    skipStones(stoneInRink: THREE.Object3D[]): void {
        for (let stone of stoneInRink) {
            if (stone.name === 'blue_stone') {
                this.skipOneStone(stone);
            }
        }
    }

    stoneUp(stone: THREE.Object3D): void {
        if (stone.position.y === SCENE.POS_Y) {
            stone.position.y += 5;
        }
    }

    stoneDown(stone: THREE.Object3D): void {
        if (stone.position.y > SCENE.POS_Y) {
            stone.position.y -= 5;
        }
    }

    skipOneStone(stone: THREE.Object3D): void {
        for (let i = -100; i < 5000; i += 200) {
            setTimeout(() => {
                this.stoneUp(stone);
            }, (i + 100));
            setTimeout(() => {
                this.stoneDown(stone);
            }, (i + 200));
        }
    }

    asTheBestScore(time: string, level: Level): void {
        this.bestPlayerScore = null;
        this.isbestPlayer = false;
        this.playerService.checkBestScore(this.player.name,
            this.scoreService.getScoreBlue(), this.scoreService.getDistanceRed(), level.name)
            .then(arrayBestScore => {
                this.bestPlayerScore = arrayBestScore['response'];
                if (this.bestPlayerScore !== false) {
                    this.isbestPlayer = true;
                }
                else {
                    this.isbestPlayer = false;
                }
            })
            // TODO: Trouver le bon catch
            .catch(null);
    }
}

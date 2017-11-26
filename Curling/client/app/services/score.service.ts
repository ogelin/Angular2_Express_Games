import { Injectable } from '@angular/core';
import { StoneScore } from '../classes/stone-score';
import { PlayerService } from './player.service';
import { LevelsService } from './levels.service';
import { Level } from '../classes/level';
import { LEVEL } from '../classes/mock-levels';
import { EmitMessageService } from '../services/emit-message.service';

const enum CENTER {
    X = 0,
    Z = -340,
    RADIUS_MAX = 70,
    MAX = 79,
}

const STONE_RADIUS = 9;

@Injectable()
export class ScoreService {
    private distanceMinBlue: number;
    private distanceMinRed: number;
    private distance: number;
    private distanceX: number;
    private distanceZ: number;
    private stoneDistance: StoneScore[] = [];
    private scoreBlue = 0;
    private scoreRed = 0;
    private color: string;
    private _bestPlayerScore: any;
    private _isbestPlayer: boolean;
    private levels: Level[] = [];


    constructor(private playerService: PlayerService, private levelsService: LevelsService,
        public emitMessageService: EmitMessageService) {
        //todo
        this._isbestPlayer = false;
    }

    public distanceFromCenter(stone: THREE.Object3D): void {

        if (stone.position.x < CENTER.X) {
            this.distanceX = CENTER.X - stone.position.x;
        }
        else {
            this.distanceX = stone.position.x - CENTER.X;
        }
        if (stone.position.z < CENTER.Z) {
            this.distanceZ = stone.position.z - CENTER.Z;
        }
        else {
            this.distanceZ = CENTER.Z - stone.position.z;
        }
        this.distance = Math.pow(this.distanceX, 2) + Math.pow(this.distanceZ, 2);
        this.distance = Math.sqrt(this.distance);
    }

    public stoneInCircle(stone: THREE.Object3D): void {
        this.distanceFromCenter(stone);
        this.addStone(stone);
    }

    public addStone(stone: THREE.Object3D): void {
        if (this.distance <= (CENTER.RADIUS_MAX + STONE_RADIUS)) {
            this.stoneDistance.push(new StoneScore(this.distance, stone.name));

            if (this.distance < this.distanceMinBlue && stone.name === 'blue_stone') {
                this.distanceMinBlue = this.distance;
            }
            else if (this.distance < this.distanceMinRed && stone.name === 'red_stone') {
                this.distanceMinRed = this.distance;
            }
        }
    }

    public score(stoneInRink: THREE.Object3D[]): void {
        this.distanceMinBlue = CENTER.MAX;
        this.distanceMinRed = CENTER.MAX;

        for (let stone of stoneInRink) {
            this.stoneInCircle(stone);
        }
        if (this.distanceMinBlue < this.distanceMinRed) {
            this.nearestStoneIsBlue(this.stoneDistance);
        }
        else if (this.distanceMinRed < this.distanceMinBlue) {
            this.nearestStoneIsRed(this.stoneDistance);
        }

        this.emptyArray();
    }

    public nearestStoneIsBlue(stoneDistance: StoneScore[]): void {
        for (let i = 0; i < stoneDistance.length; i++) {
            if (stoneDistance[i].distance < this.distanceMinRed
                && stoneDistance[i].name === 'blue_stone') {
                this.scoreBlue++;
                this.color = 'blue_stone';
            }
        }
    }

    public nearestStoneIsRed(stoneDistance: StoneScore[]): void {
        for (let i = 0; i < stoneDistance.length; i++) {
            if (stoneDistance[i].distance < this.distanceMinBlue
                && stoneDistance[i].name === 'red_stone') {
                this.scoreRed++;
                this.color = 'red_stone';
            }
        }
    }

    public isInCircle(stone: THREE.Object3D): boolean {
        this.distanceFromCenter(stone);
        if (this.distance <= CENTER.RADIUS_MAX + STONE_RADIUS) {
            return true;
        }
        return false;
    }

    public emptyArray() {
        while (this.stoneDistance.length !== 0) {
            this.stoneDistance.pop();
        }
    }

    public emptyArrayTest(stoneDistance: StoneScore[]) {
        while (stoneDistance.length !== 0) {
            stoneDistance.pop();
        }
    }

    public getDistance(): number {
        return this.distance;
    }

    public setDistance(distance: number): void {
        this.distance = distance;
    }

    public getDistanceBlue(): number {
        return this.distanceMinBlue;
    }

    public setDistanceBlue(distance: number): void {
        this.distanceMinBlue = distance;
    }

    public getDistanceRed(): number {
        return this.distanceMinRed;
    }

    public setDistanceRed(distance: number): void {
        this.distanceMinRed = distance;
    }

    public getColor(): string {
        return this.color;
    }

    public getScoreBlue(): number {
        return this.scoreBlue;
    }

    public setScoreBlue(score: number) {
        this.scoreBlue = score;
    }

    public getScoreRed(): number {
        return this.scoreRed;
    }

    public setScoreRed(score: number) {
        this.scoreRed = score;
    }

    public asTheBestScore(username: string): void {
        this._bestPlayerScore = null;
        this._isbestPlayer = false;
        this.playerService.checkBestScore(username, this.scoreBlue, this.scoreRed,
            this.levelInEnglish(LEVEL[0].name))
            .then(arrayBestScore => {
                this._bestPlayerScore = arrayBestScore['response'];
                this.emitMessageService.publish({ done: 'bestScore' });

                if (this._bestPlayerScore !== false) {
                    this._isbestPlayer = true;
                }
                else {
                    this._isbestPlayer = false;
                }
            })
            // TODO: Trouver le bon catch
            .catch(null);
    }

    getLevel(): void {
        this.levelsService.getLevel().then(levels => this.levels = levels);
    }

    public levelInEnglish(level: string): string {
        if (level.toLowerCase() === "normal") {
            return "normal";
        }
        else {
            return "hard";
        }
    }
    getBestScore(): Promise<any> {
        return new Promise<any>((resolve) => {
            resolve(this._bestPlayerScore);
        });
    }
}

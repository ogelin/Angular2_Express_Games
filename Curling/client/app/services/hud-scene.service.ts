import { Injectable } from '@angular/core';
import { VIEWING, SPRITE, POSITION, ROUND } from '../classes/properties';
import { ScoreService } from './score.service';
import { EmitMessageService } from './emit-message.service';
import { Object3DManagerService } from './object3D-manager.service';
import { LevelsService } from './levels.service';
import { Level } from '../classes/level';
import { STONE } from '../classes/properties';

@Injectable()
export class HudSceneService {
    private _context: CanvasRenderingContext2D;
    private _hudTexture: THREE.Texture;
    private _hudCanvas: HTMLCanvasElement;
    private _sceneHUD: THREE.Scene;
    private _cameraHUD: THREE.OrthographicCamera;
    private _levels: Level[] = [];
    private _finish = false;
    private _finishShot = false;
    private _handOver = false;
    private _finalScore = false;
    private _numberRound = 1;
    private _username: string;

    constructor(private scoreService: ScoreService, private object3DService: Object3DManagerService,
        private levelsService: LevelsService, private emitMessageService: EmitMessageService) {
        this.messageObsevable();
        this.getLevel();
    }

    public get username() {
        return this._username;
    }

    messageObsevable() {
        //receive all message from renderservice
        this.emitMessageService.event.subscribe((done: any) => {
            let message = (done.done as string);
            let messageType = message.substring(0, message.indexOf('.'));
            let value = message.substring(messageType.length + 1, message.length);
            if (messageType === 'finish') {
                this._finish = (value === 'true') ? true : false;
            }
            else if (messageType === 'finishShot') {
                this._finishShot = (value === 'true') ? true : false;
            }
            else if (messageType === 'handOver') {
                this._handOver = (value === 'true') ? true : false;
            }
            else if (messageType === 'finalScore') {
                this._finalScore = (value === 'true') ? true : false;
            }
            else if (messageType === 'numberRound') {
                this._numberRound = +value;
            }
        });
    }


    initHUD() {
        this._hudCanvas = document.createElement('canvas');
        let width = window.innerWidth;
        let height = window.innerHeight;
        this._hudTexture = new THREE.Texture(this._hudCanvas);
        this._hudTexture.minFilter = THREE.LinearFilter;
        this._hudTexture.needsUpdate = true;
        this._hudCanvas.width = width;
        this._hudCanvas.height = height;

        this._context = this._hudCanvas.getContext('2d');
        this._context.clearRect(0, 0, width, height);
        this._context.font = "Normal 20px Arial";
        this._context.fillStyle = "rgba(245,245,245,0.2)";
        this._context.textAlign = 'center';
        this._context.fillText('Pointage', width / 2, height / 2);
        this._context.fillStyle = "#3172df";
        this._hudTexture.needsUpdate = true;

        this._cameraHUD = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2,
            VIEWING.NEAR, VIEWING.FAR);
        this._sceneHUD = new THREE.Scene();

        let material = new THREE.MeshBasicMaterial({
            map: this._hudTexture,
            transparent: true
        });

        let planeGeometry = new THREE.PlaneGeometry(width, height);
        let plane = new THREE.Mesh(planeGeometry, material);
        material.needsUpdate = true;

        this._sceneHUD.add(plane);

        for (let i = 0; i < SPRITE.NB_STONE; i++) {
            let yPos = i * SPRITE.DISTANCE_STONE;
            this.object3DService.putSpriteInScene(yPos, this._sceneHUD);
        }
    }

    rendererHud(renderer: THREE.Renderer) {
        renderer.render(this._sceneHUD, this._cameraHUD);
    }

    splitUrl(stringToSplit: string, separator: string): string {
        let arrayOfStrings = stringToSplit.split(separator).reverse();
        return arrayOfStrings[0];
    }

    isNextTurn(): boolean {
        if (this.object3DService.stonesInRink.length < STONE.NB_MAX) {
            return true;
        }
        return false;
    }

    public getLevel(): void {
        this.levelsService.getLevel().then(levels => this._levels = levels);
    }

    public get camera() {
        return this._cameraHUD;
    }

    public get sceneHUD() {
        return this._sceneHUD;
    }

    public clearRect() {
        if (this._context !== null) {
            let level = (this._levels[0] === undefined) ? "" : this._levels[0].name;
            let url = window.document.URL.toString();
            this._username = this.splitUrl(url, "/");

            this._context.clearRect(0, 0, this._hudCanvas.width, this._hudCanvas.height);
            this._context.fillText('Joueur humain: ' + this._username, POSITION.POS_X, POSITION.POS_Y);
            this._context.fillText('Pointage', this._hudCanvas.width / 2, POSITION.POS_Y);
            this._context.fillText(this.scoreService.getScoreBlue() + '-' + this.scoreService.getScoreRed(),
                this._hudCanvas.width / 2, 2 * POSITION.POS_Y);
            this._context.fillText('Manche en cours : ' + this._numberRound,
                this._hudCanvas.width / 2, 3 * POSITION.POS_Y);
            this._context.fillText('Joueur virtuel: CPU ' + level, this._hudCanvas.width
                - POSITION.POS_X, POSITION.POS_Y);
            this._hudTexture.needsUpdate = true;

            if (!this.isNextTurn() && this._finish && this._numberRound < ROUND.NB_ROUND) {
                this._context.fillText("Appuyer sur la barre d'espace ou cliquer afin de passer à la prochaine manche",
                    this._hudCanvas.width / 2, this._hudCanvas.height - POSITION.POS_Y);
            }

            if (this._finishShot && !this._handOver && !this._finish) {
                this._context.fillText("Appuyer sur la barre d'espace ou cliquer afin de passer au prochain tir",
                    this._hudCanvas.width / 2, this._hudCanvas.height - POSITION.POS_Y);
            }

            if (!this.isNextTurn() && this._finish && this._numberRound === ROUND.NB_ROUND && this._finalScore) {
                if (this.scoreService.getScoreBlue() === this.scoreService.getScoreRed()) {
                    this._context.fillText("Partie nulle!", this._hudCanvas.width / 2, 8 * POSITION.POS_Y);
                }
                else if (this.scoreService.getScoreBlue() > this.scoreService.getScoreRed()) {
                    this._context.fillText("Félicitations " + this._username + " vous avez gagné!",
                        this._hudCanvas.width / 2, 8 * POSITION.POS_Y);
                }
                else if (this.scoreService.getScoreBlue() < this.scoreService.getScoreRed()) {
                    this._context.fillText("Le CPU a gagné", this._hudCanvas.width / 2, 8 * POSITION.POS_Y);
                }
            }
        }
    }
}

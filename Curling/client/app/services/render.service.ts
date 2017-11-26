import { Injectable } from '@angular/core';

import { Level } from '../classes/level';

import { CameraService } from './camera.service';
import { ObjectCreaterService } from './object-creater.service';
import { LightService } from './light.service';
import { VirtualPlayer } from '../classes/virtual-player';
import { PlayerService } from '../services/player.service';
import { LevelsService } from '../services/levels.service';
import { GamePhysicsService } from '../services/game-physics.service';
import { Object3DManagerService } from '../services/object3D-manager.service';
import { EmitMessageService } from '../services/emit-message.service';
import { HudSceneService } from '../services/hud-scene.service';

import {
    PHYSICS, EVENT, ROUND, STONE, LINE,
    SPIN_CLOCKWISE, RED_STONE, BLUE_STONE,
    LIGHT, SKYBOX, SPEED, SWEEPING, TOUR,
    MOUSE
} from '../classes/properties';
import { ActivatedRoute } from '@angular/router';
import { ScoreService } from '../services/score.service';
import { EndGameService } from '../services/end-game.service';
import { Confetti } from '../classes/confetti';


@Injectable()
export class RenderService {
    public _scene: THREE.Scene;
    private _renderer: THREE.Renderer;
    private _stoneColor: string;
    private _text: string;

    private _materialArray: THREE.MeshBasicMaterial[] = [];
    private _skyboxMaterial: THREE.MeshFaceMaterial;
    private _skyboxGeom: THREE.CubeGeometry;
    private _skybox: THREE.Mesh;


    private _frictionStart = PHYSICS.FRICTION_START;

    private _virtualPlayer: VirtualPlayer;
    private _levels: Level[] = [];
    private _numberRound = 1;
    private _stoneInCollision: THREE.Object3D;
    private _radiusLine = new THREE.Line;
    private _mouseDown: boolean;
    private _activeSpin: THREE.Sprite;
    private _spinRotation: number;
    private _endGame = false;
    private _finishShot = false;
    private _isLaunch = false;
    private _stoneStop = true;
    private _handOver = false;
    private _isRedStone = false;
    private _finalScore = false;
    private _restart = false;
    private _nbShot = 0;
    private _tour = 0;
    private _confetti: Confetti;

    constructor(private cameraService: CameraService,
        private playerService: PlayerService, private levelsService: LevelsService,
        private activatedRoute: ActivatedRoute, private objectCreaterService: ObjectCreaterService,
        private lightService: LightService, private gamePhysicsService: GamePhysicsService,
        private object3DManagerService: Object3DManagerService,
        private scoreService: ScoreService, public emitMessageService: EmitMessageService,
        public endGameService: EndGameService, private hudSceneService: HudSceneService) {
        this.getLevel();
        this._virtualPlayer = new VirtualPlayer();
    }

    public init(container: HTMLElement) {
        //prepare the skybox
        let texloader = new THREE.TextureLoader();
        this._materialArray = this.createSkyBoxMaterial(texloader);
        this._skyboxMaterial = new THREE.MeshFaceMaterial(this._materialArray);
        this._skyboxGeom = new THREE.CubeGeometry(5000, 5000, 5000, 1, 1, 1);
        this._skybox = new THREE.Mesh(this._skyboxGeom, this._skyboxMaterial);

        // load all objectcs before start
        this.object3DManagerService.loadObjects().then(res => {
            this.initializeGame();

            this.initiliazeRenderer(container);

            //emit a message to glComponent when all objects are created and the scene ready
            this.emitMessageService.publish({ done: 'load' });

            this.eventsListerner(container);

            this.animate();
        });


    }

    public initiliazeRenderer(container: HTMLElement) {
        this._renderer = new THREE.WebGLRenderer({
            antialias: true
        });

        // Important : if not disabled, background will be rendered as background color (black)
        this._renderer['autoClear'] = false;
        this._renderer.setSize(window.innerWidth, window.innerHeight);

        // Inser the canvas into the DOM
        //var container = document.getElementById("glContainer");
        if (container.getElementsByTagName('canvas').length === 0) {
            container.appendChild(this._renderer.domElement);
        }
    }

    public get username() {
        return this.hudSceneService.username;
    }

    initializeGame() {
        this._virtualPlayer.setLevel(this._levels[0].name);
        this._scene = new THREE.Scene();

        // initialize the scene HUD
        this.hudSceneService.initHUD();

        this.object3DManagerService.isLaunch = this._isLaunch;
        this.object3DManagerService.stopStone = this._stoneStop;

        this.cameraService.putPerspectiveCameraToScene(this._scene);

        this._scene.add(this._skybox);
        this._scene.add(this.object3DManagerService.broom);

        let rink = this.object3DManagerService.rink;
        this._scene.add(rink);
        this.lightService.putLightToScene(this._scene, new THREE.Vector3(LIGHT.POS_X, LIGHT.POS_Y, LIGHT.POS_Z));

        //init scene for celebration
        this._confetti = new Confetti();
        this._confetti.initScene(this._scene);

        this._stoneColor = this.randomStoneColor();
        this.object3DManagerService.initializeNewStoneInRink(this._scene, this._stoneColor);
        this._radiusLine = this.gamePhysicsService.createRadiusLine();
        this._radiusLine.visible = false;
        this._scene.add(this._radiusLine);

        if (this._stoneColor === RED_STONE) {
            this._isRedStone = true;
            setTimeout(() => {
                this.virtualPlayerLaunch();
            }, 2000);
        }
    }

    private randomValue(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    randomStoneColor(): string {
        let radom = this.randomValue(0, 1);
        return (radom === 1) ? BLUE_STONE : RED_STONE;
    }

    createSkyBoxMaterial(texloader: THREE.TextureLoader): THREE.MeshBasicMaterial[] {
        let materialArray: THREE.MeshBasicMaterial[] = [];

        materialArray
            .push(new THREE.MeshBasicMaterial({ map: texloader.load('../assets/images/posx.jpg') }));
        materialArray
            .push(new THREE.MeshBasicMaterial({ map: texloader.load('../assets/images/negx.jpg') }));
        materialArray
            .push(new THREE.MeshBasicMaterial({ map: texloader.load('../assets/images/posy.jpg') }));
        materialArray
            .push(new THREE.MeshBasicMaterial({ map: texloader.load('../assets/images/negy.jpg') }));
        materialArray
            .push(new THREE.MeshBasicMaterial({ map: texloader.load('../assets/images/posz.jpg') }));
        materialArray
            .push(new THREE.MeshBasicMaterial({ map: texloader.load('../assets/images/negz.jpg') }));

        for (let i = 0; i < SKYBOX.LENGTH; i++) {
            materialArray[i].side = THREE.BackSide;
        }
        return materialArray;
    }

    animate(): void {
        window.requestAnimationFrame(_ => this.animate());
        this.render();
    }

    setRadius(line: THREE.Line, mouseX?: number) {
        this._radiusLine.visible = true;
        if (mouseX !== undefined) {
            if (!this._isLaunch && !this._mouseDown && !this._handOver) {
                if (mouseX >= -MOUSE.POS_X && mouseX <= MOUSE.POS_X) {
                    line.rotation.y = LINE.RADIUS_INC * -mouseX;
                }
            }
        }
        line.geometry =
            this.gamePhysicsService.checkCollisionWithLine(line, this._scene);
        line.geometry.verticesNeedUpdate = true;
    }


    onWindowResize() {
        let factor = 1;
        let newWidth: number = window.innerWidth * factor;
        let newHeight: number = window.innerHeight * factor;

        this.cameraService.getActiveCamera().aspect = newWidth / newHeight;
        this.cameraService.getActiveCamera().updateProjectionMatrix();

        this._renderer.setSize(newWidth, newHeight);
    }

    render(): void {
        this.hudSceneService.clearRect();
        this._renderer.render(this._scene, this.cameraService.getActiveCamera());
        let r: any = this._renderer;
        r.clearDepth();

        this.hudSceneService.rendererHud(this._renderer);
    }


    onResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.cameraService.getActiveCamera().aspect = width / height;
        this.cameraService.getActiveCamera().updateProjectionMatrix();

        this._renderer.setSize(width, height);
    }

    /* This version loads the font each time, not efficient ! */
    slowCreateText() {
        //todo
    }

    private refreshText(): void {
        this.slowCreateText();
    }

    public setText(newText: string): void {
        this._text = newText;
        this.refreshText();
    }

    public changeView() {
        this.cameraService.changeView();
    }

    public nextPlayer(stoneColor: string) {
        this._handOver = (stoneColor === BLUE_STONE) ? true : false;
        this.emitMessageService.publish({ done: 'handOver.' + this._handOver });
    }

    public initializeLaunchStone(speed: number, radius?: number): void {
        this._nbShot++;
        if (!this._isLaunch) {
            this.object3DManagerService.speedPercentage = speed;
            let rad = (radius === undefined) ? this._radiusLine.rotation.y : radius;
            rad = parseFloat(rad.toFixed(2));

            if (this._stoneStop) {
                if (!this.abordLaunch(speed)) {
                    this.setLaunchStartValue();
                    let currentStone = this.object3DManagerService.activeStone;
                    this.nextPlayer(currentStone.name);
                    if (this._handOver) {
                        this.showBroom();
                    }
                    else {
                        this.hideBroom();
                    }
                    this.launchStoneAnimate(currentStone, rad);
                    this.object3DManagerService.activeSpin.visible = false;
                }
            }
        }
    }

    public get isRedStone(): boolean {
        return this._isRedStone;
    }

    private checkIfCanSweepMouse() {
        if (this._handOver && this._mouseDown) {
           if (this.gamePhysicsService.sweepMouseDown() && this._mouseDown) {
                this.object3DManagerService.speedPercentage += 0.03;
           }
        }
    }

    private checkIfCanStopBroomSound() {
        if (this.gamePhysicsService.sweepMouseDown() && this._handOver) {
            if ((this.object3DManagerService.activeStone.position.z <= SWEEPING.LIMIT_Z &&
                this.gamePhysicsService.colorIsGreen())
                || !this._mouseDown) {
                this.object3DManagerService.stopSound();
            }
        }
    }

    private checkIfCanHideStone(stone: THREE.Object3D) {
        this.gamePhysicsService.offSide(stone, this._scene);
        if ((stone.children[0].children[0] as THREE.Mesh).material.opacity <= 0) {
            this.object3DManagerService.speedPercentage = 0;
            this._scene.remove(stone);
        }
    }

    private checkIfCanDoCollision(requestId: number, radius: number) {
        this.object3DManagerService.playSound('stoneHit');
        this.object3DManagerService.speedPercentage = this.object3DManagerService.get70PercentOfSpeed(
            this.object3DManagerService.speedPercentage);
        window.cancelAnimationFrame(requestId);
        this.launchStoneAnimate(this._stoneInCollision, radius);
    }

    public launchStoneAnimate(stone: THREE.Object3D, radius: number) {
        let requestId = window.requestAnimationFrame(_ => this.launchStoneAnimate(stone, radius));

        let collisionDetect = this.checkCollision(stone);
        this.checkIfCanSweepMouse();
        this.checkIfCanStopBroomSound();

        this.gamePhysicsService.sweep();
        this.cameraService.followStone(this.cameraService.getActiveCamera(), stone);
        this.checkIfCanHideStone(stone);

        if (this.object3DManagerService.speedPercentage > 0 && !collisionDetect) {
            this.motionWithoutCollision(stone, radius);
        }
        else if (collisionDetect && this.object3DManagerService.speedPercentage > 0) {
            collisionDetect = false;
            this.checkIfCanDoCollision(requestId, radius);
        }
        else {
            this.whenStoneStop(requestId, stone);
            this.emitMessageService.publish({ done: 'stoneStop' });
        }
        this.checkIfCanEndGame();
    }

    public motionWithoutCollision(stone: THREE.Object3D, radius: number) {
        ++this._tour;

        stone.position.x -= this.object3DManagerService.getNewXposDecrement(
            this.object3DManagerService.zPosDecrement, radius);
        stone.position.z -= this.object3DManagerService.zPosDecrement;
        stone.rotation.z = this.getCurrentSpin(this._spinRotation);

        if (this._tour >= TOUR.NUMB) {
            stone.position.x += (this._spinRotation !== undefined) ? this._spinRotation * -0.03 : -0.03;
        }

        // check the friction and calculate the new speed
        if (this._tour > this._frictionStart) {
            this.object3DManagerService.stoneFriction(this.object3DManagerService.speedPercentage);
            this.object3DManagerService.zPosDecrement =
                this.object3DManagerService.getNewZposDecrement(this.object3DManagerService.speedPercentage);
            this._frictionStart = this._frictionStart + PHYSICS.FRICTION_GRAP;
        }
    }

    public whenStoneStop(requestId: number, stone: THREE.Object3D) {
        window.cancelAnimationFrame(requestId);

        this._finishShot = true;
        this.emitMessageService.publish({ done: 'finishShot.' + this._finishShot });

        if (this.scoreService.isInCircle(stone)) {
            this.lightService.putSpotLighOnStone(this._scene, stone);
        }

        if (this.isNextTurn) {
            // the virtualPlayer doesn't need to push a button or a click
            if (this._handOver) {
                //wait 2 sec before initialise the game for virtualPlayer
                setTimeout(() => {
                    this.nextTurn();
                }, 2000);
            }
        }
        else {
            this._endGame = true;
            this.emitMessageService.publish({ done: 'finish.' + this._endGame });
            this.object3DManagerService.finish = this._endGame;
        }
    }

    public getCurrentSpin(factor?: number): number {
        let rot = (factor === undefined) ? 1 : factor;
        return rot * Date.now() * 0.001;
    }

    public abordLaunch(speedPercentage: number): boolean {
        if (speedPercentage < SPEED.MIN) {
            return true;
        }
        return false;
    }

    public setLaunchStartValue() {
        this.object3DManagerService.zPosDecrement =
            this.object3DManagerService.getNewZposDecrement(this.object3DManagerService.speedPercentage);
        this._isLaunch = true;
        this.object3DManagerService.isLaunch = this._isLaunch;
        this._stoneStop = false;
        this.object3DManagerService.stopStone = this._stoneStop;
    }

    public get isLaunch(): boolean {
        return this._isLaunch;
    }


    public backToDefaultValue() {
        this.lightService.removeSpotLightOnStone(this._scene);
        this.cameraService.backToFrontCamera();
        this.cameraService.backToDefaultPosition(this.cameraService.getActiveCamera());
        this._stoneStop = true;
        this._isLaunch = false;
        this.object3DManagerService.backToDefaulvalue();
        this._tour = 0;
        this._radiusLine.visible = false;
        this._frictionStart = PHYSICS.FRICTION_START;
    }

    nextTurn(currentStoneColor?: string) {
        this.object3DManagerService.broom.visible = false;
        this.object3DManagerService.broom.position.set(STONE.POS_X, STONE.POS_Y, STONE.POS_Z - 100);
        this.object3DManagerService.setBroomColorInRed();
        this._finishShot = false;
        this.emitMessageService.publish({ done: 'finishShot.' + this._finishShot });
        this.object3DManagerService.initializeNewStoneInRink(this._scene, currentStoneColor);
        this.backToDefaultValue();
        if (this._handOver) {
            this.virtualPlayerLaunch();
        }
        else {
            this._isRedStone = false;
        }
    }

    public virtualPlayerLaunch(): void {
        this._isRedStone = true;

        // wait 2 sec before virtualPlayer to launch is stone
        setTimeout(() => {
            // multiply by LINE.RADIUS_INC  because we want the radius in radian
            let radius = LINE.RADIUS_INC * this._virtualPlayer.getLaunch('radius');
            let speed = this._virtualPlayer.getLaunch('speed');
            this._radiusLine.rotation.y = radius;
            this.setRadius(this._radiusLine);
            this._spinRotation = (this._radiusLine.rotation.y > 0) ? -1 : 1;
            this.initializeLaunchStone(speed, radius);

        }, 2000);
    }

    public checkCollision(stone: THREE.Object3D): boolean {
        this._stoneInCollision = this.gamePhysicsService.checkCollision(stone, this._scene);
        if (this._stoneInCollision === undefined) {
            return false;
        }
        else {
            return true;
        }
    }

    getLevel(): void {
        this.levelsService.getLevel().then(levels => this._levels = levels);
    }

    public get isNextTurn(): boolean {
        if (this.object3DManagerService.stonesInRink.length < STONE.NB_MAX) {
            return true;
        }
        return false;
    }

    nextRound(): void {
        this.scoreService.score(this.object3DManagerService.stonesInRink);
        let color = this.scoreService.getColor();

        //In case there's a tie in the first round
        if (color === undefined) {
            color = this._stoneColor;
        }

        this.reinitializeNextRound(color);

        if (this.object3DManagerService.activeStone.name === RED_STONE) {
            this.virtualPlayerLaunch();
        }
        else {
            this._isRedStone = false;
        }
    }

    reinitializeNextRound(colorStone: string) {
        this._numberRound++;
        this.emitMessageService.publish({ done: 'numberRound.' + this._numberRound });
        this.object3DManagerService.showAllSprite();
        this.object3DManagerService.cleanStoneInRink(this._scene);
        this.nextTurn(colorStone);
        this._endGame = false;
        this.emitMessageService.publish({ done: 'finish.' + this._endGame });
        this._finishShot = false;
    }

    sweeping(mouseEvent: MouseEvent): void {
        let broom = this.object3DManagerService.broom;
        let positionXCursor = mouseEvent.clientX;
        let positionYCursor = mouseEvent.clientY;

        if (this.isLaunch) {
            broom.position.x = positionXCursor;
            broom.position.y = positionYCursor;
        }
    }


    public showBroom(): void {
        this.object3DManagerService.broom.visible = true;
    }

    public hideBroom(): void {
        this.object3DManagerService.broom.visible = false;
    }

    changeSpin(isLaunch: boolean) {
        if (!isLaunch && !this.isRedStone) {
            this.object3DManagerService.activeSpin.visible = true;
            let spin = this.object3DManagerService.changeSpin(this.object3DManagerService.activeSpin);
            spin.scale.set(100, 100, 1);
            spin.position.x = -200;

            if (this._activeSpin !== undefined) {
                this.hudSceneService.sceneHUD.remove(this._activeSpin);
            }
            this._activeSpin = spin;
            this.hudSceneService.sceneHUD.add(this._activeSpin);
            if (this._activeSpin.name === SPIN_CLOCKWISE) {
                this._spinRotation = -1;
            }
            else {
                this._spinRotation = 1;
            }
        }
    }

    private checkIfCanEndGame(): void {
        if (this._numberRound === ROUND.NB_ROUND && this._nbShot === ROUND.NB_SHOT && this._finishShot) {
            this.scoreService.score(this.object3DManagerService.stonesInRink);
            this._finalScore = true;
            this.emitMessageService.publish({ done: 'finalScore.' + this._finalScore });
            this.cameraService.setPositionEnd(this.cameraService.getActiveCamera());
            if (this.scoreService.getScoreBlue() > this.scoreService.getScoreRed()) {
                this.endGameService.skipStones(this.object3DManagerService.stonesInRink);
                this._confetti.manyConfettis(this.object3DManagerService.stonesInRink);
                setTimeout(() => {
                    this._restart = true;
                }, (5000));
            }
            else {
                this._restart = true;
            }

            this.emitMessageService.publish({ done: 'stoneStop' });
            this.scoreService.asTheBestScore(this.username);
        }
    }

    public set container(container: HTMLElement) {
        // Inser the canvas into the DOM
        //var container = document.getElementById("glContainer");
        if (container.getElementsByTagName('canvas').length === 0) {
            container.appendChild(this._renderer.domElement);
        }

        this.eventsListerner(container);

        //emit a message to glComponent when all objects are created and the scene ready
        this.emitMessageService.publish({ done: 'load' });
    }

    reinitializeNewGame(): void {
        this._virtualPlayer.setLevel(this._levels[0].name);

        this._numberRound = 1;
        this.emitMessageService.publish({ done: 'numberRound.' + this._numberRound });

        this.object3DManagerService.cleanStoneInRink(this._scene);
        this.scoreService.setScoreBlue(0);
        this.scoreService.setScoreRed(0);

        this._confetti.clearConfetti();
        this.emitMessageService.publish({ done: 'stoneStop' });

        this.object3DManagerService.showAllSprite();

        this._endGame = false;
        this.emitMessageService.publish({ done: 'finish.' + this._endGame });

        this._finalScore = false;
        this.emitMessageService.publish({ done: 'finalScore.' + this._finalScore });

        this._restart = false;
        this._nbShot = 0;
        this._stoneColor = this.randomStoneColor();
        this._handOver = (this._stoneColor === BLUE_STONE) ? false : true;
        this.emitMessageService.publish({ done: 'handOver.' + this._handOver });
        this.nextTurn(this._stoneColor);
    }

    public get restart(): boolean {
        return this._restart;
    }


    eventsListerner(container: HTMLElement) {
        // bind to window resizes
        //window.addEventListener('resize', _ => this.onResize());
        window.removeEventListener('resize');
        window.addEventListener('resize', _ => this.onWindowResize());

        container.addEventListener('mousemove', (event => {
            let windowHalfX = window.innerWidth / 2;
            let mouseX = (event.clientX - windowHalfX);

            if (this.object3DManagerService.activeStone.position.z > SWEEPING.LIMIT_Z &&
                this.object3DManagerService.activeStone.position.z <= SWEEPING.HOG_LINE &&
                this._isLaunch && this._mouseDown) {
                this.object3DManagerService.broom.position.x = mouseX;
            }

            if (!this._isRedStone && this.cameraService.getActiveCamera().type === 'PerspectiveCamera') {
                this.setRadius(this._radiusLine, mouseX);
            }
        }));

        container.addEventListener('mousedown', (event: MouseEvent) => {
            this._mouseDown = true;

            if (this._isLaunch && this.object3DManagerService.activeStone.position.z <= SWEEPING.HOG_LINE) {
                this.object3DManagerService.broom.position.set(
                    this.object3DManagerService.activeStone.position.x,
                    this.object3DManagerService.activeStone.position.y,
                    this.object3DManagerService.activeStone.position.z - 50);
            }

            if (event.button === EVENT.MOUSE_LEFT_BUTTON_CLICK) {
                if (!this._handOver && this._finishShot && !this._endGame) {
                    this.nextTurn();
                }

                if (this._endGame && this._numberRound < ROUND.NB_ROUND) {
                    this.nextRound();
                }
            }
        });

        container.addEventListener('mouseup', (event => {
            this._mouseDown = false;
            if (!this.gamePhysicsService.colorIsGreen() && this.isLaunch) {
                this.object3DManagerService.broom.position.set(STONE.POS_X + 80, STONE.POS_Y,
                    this.object3DManagerService.activeStone.position.z - 50);
            }
        }));


        window.removeEventListener('keydown');
        window.addEventListener('keydown', (event) => {

            if (event.keyCode === EVENT.SHIFT) {
                this.changeSpin(this._isLaunch);
            }

            if (event.keyCode === EVENT.BUTTON_C) {
                this.changeView();
            }

            if (event.keyCode === EVENT.SPACE) {
                if (!this._handOver && this._finishShot && !this._endGame) {
                    this.nextTurn();
                }

                if (this._endGame && this._numberRound < ROUND.NB_ROUND) {
                    this.nextRound();
                }
            }
        });

    }
}

import { Injectable } from '@angular/core';
import { ObjectCreaterService } from './object-creater.service';
import { LightService } from './light.service';
import { ObjectProperties } from '../classes/Object-properties';

import {
    RINK_URL, BLUE_STONE_URL, RINK, STONE, SPRITE, RED_STONE_URL, BROOM_URL, RINK_CURLING, RED_STONE, BLUE_STONE,
    SPIN_ANTI_CLOCKWISE_URL, SPIN_CLOCKWISE_URL, SPIN_CLOCKWISE, SPIN_ANTI_CLOCKWISE, RED_SPRITE, BLUE_SPRITE,
    RED_SPRITE_URL, BLUE_SPRITE_URL, BROOM_SOUND_URL, STONE_COLLISION_URL
} from '../classes/properties';

const enum BROOM {
    ANGLE = 1.5708,
    HANDLE_ANGLE = 0.17
}

@Injectable()
export class Object3DManagerService {
    private _isLaunch: boolean;
    private _stoneStop = true;

    private _stoneKeeper: THREE.Object3D[] = [];
    private _stoneInRink: THREE.Object3D[] = [];
    private _activeStone: THREE.Object3D;
    private _rink: THREE.Object3D;
    private _activeSpin: THREE.Sprite;

    private _stoneColor: string;
    private _speedPercentage: number;
    private _zPosDecrement: number;
    private _xPosDecrement: number;

    private _broom: THREE.Object3D;

    /* HUD members */
    private _spriteBlueArray: THREE.Sprite[] = [];
    private _spriteRedArray: THREE.Sprite[] = [];
    private _spriteStoneKeeper: THREE.Sprite[] = [];
    private _spriteSpinArray: THREE.Sprite[] = [];
    private _nSpriteBlue = 0;
    private _nSpriteRed = 0;
    private _stoneProperties: ObjectProperties;
    private _rinkProperties: ObjectProperties;
    private _finish: boolean;
    private _soundArray: THREE.Audio[] = [];

    constructor(private objectCreaterService: ObjectCreaterService, private lightService: LightService) {
        this.setRinkProperties();
        this.setStoneProperties();
        this._stoneColor = BLUE_STONE;
    }

    public createStone(stoneColor: string): THREE.Object3D {
        let indexStone = (this._stoneKeeper[0].name === stoneColor) ? 0 : 1;
        let stoneClone = new THREE.Object3D;
        stoneClone = this._stoneKeeper[indexStone].clone();
        this.cloneStoneMaterial(stoneClone, this._stoneKeeper[indexStone].children[0].children);
        return stoneClone;
    }

    public cloneStoneMaterial(stone: THREE.Object3D, obj3D: THREE.Object3D[]) {
        for (let idx = 0; idx < obj3D.length; idx++) {
            (stone.children[0].children[idx] as THREE.Mesh).material = (obj3D[idx] as THREE.Mesh).material.clone();
        }
    }

    public initializeNewStoneInRink(scene: THREE.Scene, stoneColor?: string): void {
        let color = (stoneColor === undefined) ? this._stoneColor : stoneColor;
        this._activeStone = this.createStone(color);

        // save the color of nextStone if stoneColor is undefine when
        // calling the function
        this._stoneColor = this.nextStoneColor(color);

        this._stoneInRink.push(this._activeStone);
        scene.add(this._activeStone);
        this.hideSprite = this._activeStone.name;
    }

    public nextStoneColor(currentStoneColor: string): string {
        let color = (currentStoneColor === BLUE_STONE) ? RED_STONE : BLUE_STONE;
        return color;
    }

    public get rink(): THREE.Object3D {
        return this._rink;
    }

    public loadObject3D(url: string): Promise<boolean> {
        let resultat = false;
        return new Promise<boolean>((resolve, error) => {
            this.objectCreaterService.loadObject3D(url).then(
                (obj: THREE.Object3D) => {
                    if (obj.name === RINK_CURLING) {
                        this.objectCreaterService.setObjectProperties(obj, this._rinkProperties);
                        this._rink = obj;
                    }
                    else {
                        this.objectCreaterService.setObjectProperties(obj, this._stoneProperties);
                        this._stoneKeeper.push(obj);
                    }
                    resultat = true;
                    resolve(resultat);
                }
            );
        });
    }

    public loadColladaObject(url: string): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            this.objectCreaterService.loadCollada(url).then((obj: THREE.ColladaModel) => {
                this._broom = obj.scene as THREE.Object3D;
                this._broom.position.x = STONE.POS_X + 80; //- 150;
                this._broom.position.y = STONE.POS_Y;
                this._broom.position.z = STONE.POS_Z - 100;
                this._broom.rotateZ(BROOM.ANGLE);
                this._broom.rotateX(BROOM.HANDLE_ANGLE);
                this.setBroomColorInRed();
                this._broom.visible = false;
                resolve(true);
            });
        });
    }

    public loadObjects(): Promise<boolean> {
        return new Promise<boolean>((resolve, error) => {
            Promise.all([
                this.loadObject3D(RINK_URL),
                this.loadObject3D(BLUE_STONE_URL),
                this.loadObject3D(RED_STONE_URL),
                this.loadColladaObject(BROOM_URL),
                this.loadSprite(SPIN_ANTI_CLOCKWISE_URL),
                this.loadSprite(SPIN_CLOCKWISE_URL),
                this.loadSprite(RED_SPRITE_URL),
                this.loadSprite(BLUE_SPRITE_URL),
                this.getSoundPromise(STONE_COLLISION_URL, this._soundArray),
                this.getSoundPromise(BROOM_SOUND_URL, this._soundArray)]).then(values => {
                    resolve(true);
                });
        });
    }

    public getSoundPromise(url: string, sound: THREE.Audio[]): Promise<Boolean> {
        return new Promise<boolean>((resolve) => {
            this.objectCreaterService.loadSound(url).then((obj) => {
                sound.push(obj);
                resolve(true);
            });
        });
    }

    public playSound(name: string) {
        for (let sound of this._soundArray) {
            if (sound.name === name) {
                sound.play();
                return;
            }
        }
    }

    public stopSound() {
        this._soundArray[1].stop();
    }

    public get spriteStoneKeeper() {
        return this._spriteStoneKeeper;
    }

    public loadSprite(url: string): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            this.objectCreaterService.loadSprite(url).then(
                (sprite: THREE.Sprite) => {
                    let w = sprite.material.map.image.width;
                    let h = sprite.material.map.image.height;
                    if (sprite.name === SPIN_CLOCKWISE || sprite.name === SPIN_ANTI_CLOCKWISE) {
                        sprite.scale.set(w / 4, h / 4, 1);

                        this._spriteSpinArray.push(sprite);
                        if (this._activeSpin === undefined) {
                            this._activeSpin = this._spriteSpinArray[0];
                        }
                    }
                    else if (sprite.name === RED_SPRITE || sprite.name === BLUE_SPRITE) {
                        if (sprite.name === RED_SPRITE) {
                            sprite.scale.set(w / 12, h / 12, 1);
                            sprite.position.set(innerWidth / 2 - SPRITE.RED_POS, -innerHeight / 3, 0);
                        }
                        else {
                            sprite.scale.set(w / 4, h / 4, 1);
                            sprite.position.set(-innerWidth / 2 + SPRITE.BLUE_POS, -innerHeight / 3, 0);
                        }
                        this._spriteStoneKeeper.push(sprite);
                    }
                    resolve(true);
                }
            );

        });
    }

    public get activeSpin(): THREE.Sprite {
        return this._activeSpin;
    }

    public changeSpin(activeSpin: THREE.Sprite): THREE.Sprite {
        if (activeSpin === this._spriteSpinArray[0]) {
            this._activeSpin = this._spriteSpinArray[1];
        }
        else {
            this._activeSpin = this._spriteSpinArray[0];
        }

        return this._activeSpin;
    }

    public get spriteSpinArray(): THREE.Sprite[] {
        return this._spriteSpinArray;
    }

    public setStoneProperties(properties?: ObjectProperties): void {
        this._stoneProperties = new ObjectProperties(
            new THREE.Vector3(STONE.POS_X, STONE.POS_Y, STONE.POS_Z),
            new THREE.Vector3(STONE.SCALE, STONE.SCALE, STONE.SCALE),
            new THREE.Euler(STONE.ANGLE),
        );
    }

    public setRinkProperties(properties?: ObjectProperties): void {
        this._rinkProperties = new ObjectProperties(
            new THREE.Vector3(RINK.POS_X, RINK.POS_Y, RINK.POS_Z),
            new THREE.Vector3(RINK.SCALE, RINK.SCALE, RINK.SCALE),
            new THREE.Euler(),
        );
    }

    // decrease the speed of stone when launch
    public stoneFriction(speedPercentage: number) {
        this._speedPercentage -= 0.5;
    }

    public set speedPercentage(speed: number) {
        this._speedPercentage = speed;
    }

    public set zPosDecrement(zPos: number) {
        this._zPosDecrement = zPos;
    }

    public set xPosDecrement(xPos: number) {
        this._zPosDecrement = xPos;
    }

    public set finish(etat: boolean) {
        this._finish = etat;
    }

    public get70PercentOfSpeed(speed: number): number {
        return (7 * speed) / 10;
    }

    public getNewZposDecrement(speedPercentage: number): number {
        return (speedPercentage * 3) / 100;
    }

    public getNewXposDecrement(zPosDecrement: number, radius: number): number {
        return zPosDecrement * Math.sin(radius);
    }

    public set isLaunch(state: boolean) {
        this._isLaunch = state;
    }

    public set stopStone(state: boolean) {
        this._stoneStop = state;
    }

    public get broom(): THREE.Object3D {
        return this._broom;
    }

    public get activeStone(): THREE.Object3D {
        return this._activeStone;
    }

    public get zPosDecrement(): number {
        return this._zPosDecrement;
    }

    public get xPosDecrement() {
        return this._xPosDecrement;
    }

    public get speedPercentage() {
        return this._speedPercentage;
    }

    public get stonesInRink(): THREE.Object3D[] {
        return this._stoneInRink;
    }

    public backToDefaulvalue() {
        this._stoneStop = true;
        this._isLaunch = false;
    }

    public set hideSprite(stoneName: string) {
        if (stoneName === RED_STONE) {
            this._spriteRedArray[this._spriteRedArray.length - ++this._nSpriteRed].visible = false;
        }
        else {
            this._spriteBlueArray[this._spriteBlueArray.length - ++this._nSpriteBlue].visible = false;
        }
    }

    public newGame(): void {
        this.backToDefaulvalue();
        this._nSpriteBlue = 0;
        this._nSpriteRed = 0;
    }

    public moveStoneInX(mouseEvent: MouseEvent, windowHalfX: number) {
        if (-4 <= mouseEvent.clientX - windowHalfX && mouseEvent.clientX - windowHalfX <= 25) {
            this._activeStone.position.x = (mouseEvent.clientX - windowHalfX);
        }
    }

    public putSpriteInScene(yPos: number, sceneHUD: THREE.Scene): void {
        let spriteBlue = new THREE.Sprite;
        spriteBlue = this._spriteStoneKeeper[SPRITE.BLUE].clone();
        spriteBlue.position.y += yPos;

        let spriteRed = new THREE.Sprite;
        spriteRed = this._spriteStoneKeeper[SPRITE.RED].clone();
        spriteRed.position.y += yPos;

        this._spriteBlueArray.push(spriteBlue);
        this._spriteRedArray.push(spriteRed);

        sceneHUD.add(this._spriteBlueArray[this._spriteBlueArray.length - 1]);
        sceneHUD.add(this._spriteRedArray[this._spriteRedArray.length - 1]);
    }

    public cleanStoneInRink(scene: THREE.Scene): void {
        for (let stone of this._stoneInRink) {
            scene.remove(stone);
        }

        while (this._stoneInRink.length !== 0) {
            this._stoneInRink.pop();
        }
    }

    public showAllSprite() {
        this._nSpriteBlue = 0;
        this._nSpriteRed = 0;
        for (let spriteIdx = 0; spriteIdx < this._spriteBlueArray.length; spriteIdx++) {
            this._spriteBlueArray[spriteIdx].visible = true;
            this._spriteRedArray[spriteIdx].visible = true;
        }
    }

    public setBroomColorInGreen() {
        this._broom.traverse((child: THREE.Mesh) => {
            child.material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        });
    }

    public setBroomColorInRed() {
        this._broom.traverse((child: THREE.Mesh) => {
            child.material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        });
    }
}

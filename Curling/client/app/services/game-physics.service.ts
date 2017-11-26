import { Injectable } from '@angular/core';
import { STONE, BLUE_STONE, RED_STONE, BROOM_OFFSIDE, SWEEPING, LINE, SCENE } from '../classes/properties';
import { Object3DManagerService } from '../services/object3D-manager.service';



@Injectable()
export class GamePhysicsService {
    private isGreen = false;

    constructor(private object3DService: Object3DManagerService) {
        //todo
    }

    public checkStoneCollision(stone1: THREE.Object3D, stone2: THREE.Object3D, radius: number): boolean {
        let distance = (stone2.position.x - stone1.position.x);
        distance = Math.sqrt(distance * distance);

        if (distance <= radius * 2) {
            return true;
        }
        else {
            return false;
        }
    }

    public findObstacles(currentStone: THREE.Object3D, scene: THREE.Scene): THREE.Object3D {
        let closerStone: THREE.Object3D;
        for (let stoneInScene of scene.children) {
            if (currentStone !== stoneInScene &&
                (stoneInScene.name === BLUE_STONE || stoneInScene.name === RED_STONE)) {
                if (currentStone !== stoneInScene
                    && currentStone.position.z >= stoneInScene.position.z
                    && this.checkStoneCollision(currentStone, stoneInScene, STONE.RADIUS)) {
                    if (closerStone === undefined || stoneInScene.position.z > closerStone.position.z) {
                        closerStone = stoneInScene;
                    }
                }
            }
        }

        return closerStone;
    }

    public offSide(stone: THREE.Object3D, scene: THREE.Scene): void {
        if (stone.position.z <= BROOM_OFFSIDE.BACK_LINE || stone.position.x >= 82
        || stone.position.x <= -82) {
            let obj = stone.children[0].children;
            for (let mesh of obj) {
                setTimeout(() => {
                    (mesh as THREE.Mesh).material.transparent = true;
                    (mesh as THREE.Mesh).material.opacity -= 0.1;
                }, 1000);
            }
        }

        if ((stone.position.z >= BROOM_OFFSIDE.HOG_LINE) && (this.object3DService.speedPercentage === 0)){
            scene.remove(stone);
        }

    }


    public createRadiusLine(): THREE.Line {
        let lineGeometry = new THREE.Geometry();
        lineGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
        lineGeometry.vertices.push(new THREE.Vector3(0, 0, -LINE.LENGTH));
        lineGeometry.computeLineDistances();

        let material = new THREE.LineDashedMaterial({ color: 0x641E16, dashSize: 3, gapSize: 1, linewidth: 2 });
        let radiusLine = new THREE.Line(lineGeometry, material);
        radiusLine.position.z = STONE.POS_Z;
        return radiusLine;
    }

    public generateLine(stone: THREE.Object3D, line: THREE.Line): THREE.Geometry {
        let lineGeometry = line.geometry as THREE.Geometry;
        lineGeometry = line.geometry as THREE.Geometry;
        let lineLenght;

        if (stone !== undefined) {
            lineLenght = -(STONE.POS_Z - stone.position.z - LINE.OFFSET);
        }
        else {
            lineLenght = Math.abs(SCENE.LIMIT_X / (Math.tan(line.rotation.y)));
            lineLenght = (lineLenght > LINE.LENGTH) ? -LINE.LENGTH : -lineLenght;
        }

        lineGeometry.vertices[1].z = lineLenght;
        return lineGeometry;
    }


    public checkCollisionWithLine(line: THREE.Line, scene: THREE.Scene): THREE.Geometry {
        let lineGeometry = line.geometry as THREE.Geometry;
        lineGeometry = line.geometry as THREE.Geometry;
        line.rotation.y = parseFloat(line.rotation.y.toFixed(2));

        let find = false;
        let stone: THREE.Object3D;
        let activeStone = this.object3DService.activeStone;

        for (let child of scene.children) {
            if (child !== activeStone && (child.name === BLUE_STONE || child.name === RED_STONE)) {
                let launchRadius = line.rotation.y;

                //calcul l'angle de chaque stone par rapport
                // à l'origine de lancement
                let posZ = STONE.POS_Z - child.position.z;
                let hypotenuse = Math.sqrt(Math.pow(posZ, 2) + Math.pow(child.position.x, 2));
                let sinusTheta = child.position.x / hypotenuse;
                let theta = Math.asin(sinusTheta);
                theta = parseFloat(theta.toFixed(2));

                //are we in x neg or positive
                theta = (theta === -0) ? 0 : theta * -1;

                if (launchRadius > theta - 0.03 && launchRadius < theta + 0.03) {
                    if (stone === undefined ||
                        (child.position.z > stone.position.z)) {
                        stone = child;
                        find = true;
                    }
                }
            }

        }

        return this.generateLine(stone, line);
    }

    public checkCollision(stone: THREE.Object3D, scene: THREE.Scene): THREE.Object3D {
        let stoneTemp = this.findObstacles(stone, scene);
        let stoneInCollision: THREE.Object3D;

        if (stoneTemp !== undefined && stone.id !== stoneTemp.id) {
            if (stone.position.z - STONE.DIAMETER <= stoneTemp.position.z) {
                stoneInCollision = stoneTemp;
                return stoneInCollision;
            }
        }
        return stoneInCollision;
    }

    public sweep(): void {
        this.object3DService.setBroomColorInRed();
        if (this.object3DService.activeStone.position.z <= SWEEPING.HOG_LINE) {
            this.object3DService.setBroomColorInGreen();
            this.isGreen = true;
        }

        if (this.object3DService.speedPercentage !== 0 &&
            this.object3DService.broom.position.z >= SWEEPING.LIMIT_SCENE) {
            this.object3DService.broom.position.z -=
                this.object3DService.zPosDecrement;
        }

        if (this.object3DService.activeStone.position.z <= SWEEPING.BACK_LINE) {
            setTimeout(() => {
                this.object3DService.broom.traverse((child: THREE.Mesh) => {
                    child.material.transparent = true;
                    child.material.opacity = child.material.opacity - 0.2;
                });
            }, 1000);
        }
    }

    public colorIsGreen(): boolean {
        return this.isGreen;
    }

    public sweepMouseDown(): boolean {
        if (this.object3DService.activeStone.name !== RED_STONE && this.colorIsGreen() && (
            this.object3DService.activeStone.position.z >= SWEEPING.BACK_LINE ||
            this.object3DService.activeStone.position.z < SWEEPING.HOG_LINE)) {
            this.object3DService.playSound('broomSound');
            return true;
        }
        return false;
    }

}

import { GamePhysicsService } from '../services/game-physics.service';
import { Object3DManagerService } from '../services/object3D-manager.service';
import { LightService } from '../services/light.service';
import { ObjectCreaterService } from '../services/object-creater.service';
import {
    STONE, BLUE_STONE, BLUE_STONE_URL, RED_STONE, RED_STONE_URL, BROOM_URL,
} from '../classes/properties';

import { assert, expect } from 'chai';
import * as SinonChai from 'sinon-chai';
chai.use(SinonChai);

let lightService = new LightService();
let objectCreaterService = new ObjectCreaterService();
let object3DService = new Object3DManagerService(objectCreaterService, lightService);
let stone1 = new THREE.Object3D();
let stone2 = new THREE.Object3D();
let scene = new THREE.Scene;
let broomScene = new THREE.Object3D;

object3DService.loadObject3D(BLUE_STONE_URL).then(() => {
    object3DService.loadObject3D(RED_STONE_URL).then(() => {
        stone1 = object3DService.createStone(BLUE_STONE);
        stone2 = object3DService.createStone(RED_STONE);
        scene.add(stone1);
        scene.add(stone2);
    });
});

object3DService.loadColladaObject(BROOM_URL).then(() => {
    broomScene = object3DService.broom;
    scene.add(broomScene);
});



describe('GamePhysicsService', () => {
    let gamePhysicsService: GamePhysicsService;
    let line: THREE.Line;
    let geometry: THREE.Geometry;
    let radius = 2;

    beforeEach(function () {
        gamePhysicsService = new GamePhysicsService(object3DService);
        line = gamePhysicsService.createRadiusLine();
    });

    it('Should always pass', function () {
        assert.isTrue(true);
    });

    describe('checkStoneCollision', () => {
        it('Should not detect collision for Stone1.x = 4, Stone2.x = 12. radius = 2', function () {
            stone1.position.x = 4;
            stone2.position.x = 12;
            assert.isFalse(gamePhysicsService.checkStoneCollision(stone1, stone2, radius));
        });

        it('Should detect collision for Stone1.x = 4, Stone2.x = 4. radius = 2', function () {
            stone1.position.x = 4;
            stone2.position.x = 4;
            assert.isTrue(gamePhysicsService.checkStoneCollision(stone1, stone2, radius));
        });

        it('Should detect collision for Stone1.x = 4, Stone2.x = 6. radius = 2', function () {
            stone1.position.x = 4;
            stone2.position.x = 6;
            assert.isTrue(gamePhysicsService.checkStoneCollision(stone1, stone2, radius));
        });

        it('Should detect collision for Stone1.x = 4, Stone2.x = 7. radius = 2', function () {
            stone1.position.x = 4;
            stone2.position.x = 7;
            assert.isTrue(gamePhysicsService.checkStoneCollision(stone1, stone2, radius));
        });

        it('Should detect collision for Stone1.x = -4, Stone2.x =-7. radius = 2', function () {
            stone1.position.x = -4;
            stone2.position.x = -7;
            assert.isTrue(gamePhysicsService.checkStoneCollision(stone1, stone2, radius));
        });

        it('Should detect collision for Stone1.x = 0, Stone2.x = 0. radius = 2', function () {
            stone1.position.x = 0;
            stone2.position.x = 0;
            assert.isTrue(gamePhysicsService.checkStoneCollision(stone1, stone2, radius));
        });

        it('Should not detect collision for Stone1.x = -5, Stone2.x = 0. radius = 2', function () {
            stone1.position.x = -5;
            stone2.position.x = 0;
            assert.isFalse(gamePhysicsService.checkStoneCollision(stone1, stone2, radius));
        });

        it('Should not detect collision for Stone1.x = -6, Stone2.x = -1. radius = 2', function () {
            stone1.position.x = -6;
            stone2.position.x = -1;
            assert.isFalse(gamePhysicsService.checkStoneCollision(stone1, stone2, radius));
        });

        it('Should detect collision for Stone1.x = 2, Stone2.x = -1. radius = 4', function () {
            stone1.position.x = 2;
            stone2.position.x = -1;
            radius = 4;
            assert.isTrue(gamePhysicsService.checkStoneCollision(stone1, stone2, radius));
        });

        it('Should detect collision for Stone1.x = 2, Stone2.x = -2. radius = 4', function () {
            stone1.position.x = 2;
            stone2.position.x = -2;
            assert.isTrue(gamePhysicsService.checkStoneCollision(stone1, stone2, radius));
        });
    });

    describe('CreateRadiusLine', () => {
        it('Should create a line', function () {
            line = gamePhysicsService.createRadiusLine();
            expect(line).to.not.be.undefined;
        });

        it('Line pos z should equal STONE.POS_Z', function () {
            expect(line.position.z).to.equal(STONE.POS_Z);
        });

        it('Line length should equal -850', function () {
            geometry = line.geometry as THREE.Geometry;
            expect(geometry.vertices[1].z).to.equal(-850);
        });
    });

    describe('CheckCollisionWithLine', () => {
        it('Should  detect collision with stone1 and reduce the line lenght', function () {
            stone1.position.z = 0;
            line.rotation.y = 0;
            line.geometry = gamePhysicsService.checkCollisionWithLine(line, scene);
            expect(line.geometry.vertices[1].z).to.equal(-(STONE.POS_Z - stone1.position.z - 15));
        });

        it('Should not detect collision with stone1 and  the line lenght shoul equal -850', function () {
            stone1.position.z = 0;
            line.rotation.y = 0.05;
            line.geometry = gamePhysicsService.checkCollisionWithLine(line, scene);
            expect(line.geometry.vertices[1].z).to.not.equal(-(STONE.POS_Z - stone1.position.z - 15));
        });
    });

    describe('findObstacles', () => {
        it('Should  detect obstacle in z = 10', function () {
            stone1.position.set(0, 1, 10);
            stone2.position.set(0, 1, 5);
            let closerStone = gamePhysicsService.findObstacles(stone1, scene);
            expect(closerStone.position).to.equal(stone2.position);
        });

        it('Should  detect obstacle in z = -50', function () {
            stone1.position.set(0, 1, 10);
            stone2.position.set(0, 1, -50);
            let closerStone = gamePhysicsService.findObstacles(stone1, scene);
            expect(closerStone.position).to.equal(stone2.position);
        });

        it('Should not  detect obstacle', function () {
            stone1.position.set(0, 1, 10);
            stone2.position.set(-20, 1, -50);
            let closerStone = gamePhysicsService.findObstacles(stone1, scene);
            expect(closerStone).to.be.undefined;
        });

        it('Should detect obstacle in xyz(-20,1,-50)', function () {
            stone1.position.set(-5, 1, 10);
            stone2.position.set(-10, 1, -50);
            let closerStone = gamePhysicsService.findObstacles(stone1, scene);
            expect(closerStone.position).to.to.equal(stone2.position);
        });

        it('Should detect obstacle in position of stone3', function () {
            let stone3 = object3DService.createStone('red_stone');
            stone3.position.set(-10, 1, -20);
            scene.add(stone3);
            stone1.position.set(-5, 1, 10);
            stone2.position.set(-10, 1, -50);
            let closerStone = gamePhysicsService.findObstacles(stone1, scene);
            expect(closerStone.position).to.to.equal(stone3.position);
        });

        it('Should detect obstacle in position of stone2, the first that get in the scene', function () {
            stone1.position.set(-5, 1, 10);
            stone2.position.set(-10, 1, -20);
            let closerStone = gamePhysicsService.findObstacles(stone1, scene);
            expect(closerStone.position).to.to.equal(stone2.position);
        });
    });

    describe('generateLine', () => {
        let lineLenght = 0;
        let lineGeometry;
        let stone;
        it('Should  generate the line because it get in collision with stone1 ', function () {
            lineGeometry = gamePhysicsService.generateLine(stone1, line);
            lineLenght = -(STONE.POS_Z - stone1.position.z - 15);
            expect(lineGeometry.vertices[1].z).to.equal(lineLenght);
        });

        it('Should  generate the line with maximum lenght because there isnt obstacle', function () {
            stone = undefined;
            lineGeometry = gamePhysicsService.generateLine(stone, line);
            lineLenght = -850;
            expect(lineGeometry.vertices[1].z).to.equal(lineLenght);
        });

        it('Should  generate the line because its going outside the scene in x neg', function () {
            stone = undefined;
            line.rotation.y = 0.261799;
            lineGeometry = gamePhysicsService.generateLine(stone, line);
            lineLenght = Math.abs(92 / (Math.tan(line.rotation.y)));
            lineLenght = (lineLenght > 850) ? -850 : -lineLenght;
            expect(lineGeometry.vertices[1].z).to.equal(lineLenght);
        });

        it('Should  generate the line because its going outside the scene in x pos', function () {
            stone = undefined;
            line.rotation.y = -0.261799;
            lineGeometry = gamePhysicsService.generateLine(stone, line);
            lineLenght = Math.abs(92 / (Math.tan(line.rotation.y)));
            lineLenght = (lineLenght > 850) ? -850 : -lineLenght;
            expect(lineGeometry.vertices[1].z).to.equal(lineLenght);
        });
    });

    describe('checkCollision', () => {
        it('stone1 should get in collision with stone 2', function () {
            for (let child of scene.children) {
                scene.remove(child);
            }
            stone1.position.set(0, 1, 50);
            stone2.position.set(0, 1, 40);
            scene.add(stone1);
            scene.add(stone2);
            let stoneInCollision = gamePhysicsService.checkCollision(stone1, scene);
            expect(stoneInCollision.position).to.equal(stone2.position);
        });

        it('stone1 should not get in collision with stone 2', function () {
            stone2.position.set(0, 1, 0);
            let stoneInCollision = gamePhysicsService.checkCollision(stone1, scene);
            expect(stoneInCollision).to.be.undefined;
        });

    });

    describe('offSide', () => {
        it('stone should disappear in z axis', function () {
            stone1.position.z = -480;
            let stoneOut = gamePhysicsService.offSide(stone1, scene);
            expect(stoneOut).to.be.undefined;
        });

        it('stone should disappear in x axis by the left', function () {
            stone1.position.x = -100;
            let stoneOut = gamePhysicsService.offSide(stone1, scene);
            expect(stoneOut).to.be.undefined;
        });

        it('stone should disappear in x axis by the right', function () {
            stone1.position.x = 100;
            let stoneOut = gamePhysicsService.offSide(stone1, scene);
            expect(stoneOut).to.be.undefined;
        });

        it('stone should disappear before hog line', function () {
            stone1.position.z = 230;
            let stoneOut = gamePhysicsService.offSide(stone1, scene);
            expect(stoneOut).to.be.undefined;
        });

    });

});

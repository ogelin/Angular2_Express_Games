import { ScoreService } from '../services/score.service';
import { PlayerService } from '../services/player.service';
import { LevelsService } from '../services/levels.service';
import { StoneScore } from '../classes/stone-score';
import { EmitMessageService } from '../services/emit-message.service';

import { expect } from 'chai';
import * as SinonChai from 'sinon-chai';
chai.use(SinonChai);

describe('ScoreService', () => {
    let playerService: PlayerService;
    let levelsService: LevelsService;
    let emitMessageService: EmitMessageService;
    let scoreService: ScoreService;
    let stone1 = new THREE.Object3D();
    let stoneDistance: StoneScore[] = [];

    beforeEach(function () {
        scoreService = new ScoreService(playerService, levelsService, emitMessageService);
    });

    it('Distance should be of 10', function () {
        stone1.position.x = 10;
        stone1.position.z = -340;
        scoreService.distanceFromCenter(stone1);
        expect(scoreService.getDistance()).to.equal(10);
    });

    it('Distance should be of sqrt(401)', function () {
        stone1.position.x = -20;
        stone1.position.z = -341;
        scoreService.distanceFromCenter(stone1);
        expect(scoreService.getDistance()).to.equal(Math.sqrt(401));
    });

    it('Distance should be of 20*sqrt(2)', function () {
        stone1.position.x = 20;
        stone1.position.z = -320;
        scoreService.distanceFromCenter(stone1);
        expect(scoreService.getDistance()).to.equal(20 * Math.sqrt(2));
    });

    it('Distance should be of 0', function () {
        stone1.position.x = 0;
        stone1.position.z = -340;
        scoreService.distanceFromCenter(stone1);
        expect(scoreService.getDistance()).to.equal(0);
    });

    it('Distance blue should be of 5', function () {
        stone1.name = 'blue_stone';
        scoreService.setDistance(5);
        scoreService.setDistanceBlue(20);
        scoreService.addStone(stone1);
        expect(scoreService.getDistanceBlue()).to.equal(5);
    });

    it('Distance red should be of 4', function () {
        stone1.name = 'red_stone';
        scoreService.setDistance(8);
        scoreService.setDistanceRed(4);
        scoreService.addStone(stone1);
        expect(scoreService.getDistanceRed()).to.equal(4);
    });

    it('Distance red should be of 2', function () {
        stone1.name = 'red_stone';
        scoreService.setDistance(2);
        scoreService.setDistanceRed(3);
        scoreService.addStone(stone1);
        expect(scoreService.getDistanceRed()).to.equal(2);
    });

    it('Distance red should be of 78.5', function () {
        stone1.name = 'red_stone';
        scoreService.setDistance(78.5);
        scoreService.setDistanceRed(80);
        scoreService.addStone(stone1);
        expect(scoreService.getDistanceRed()).to.equal(78.5);
    });

    it('Score blue should be 1', function () {
        scoreService.emptyArrayTest(stoneDistance);
        scoreService.setScoreBlue(0);
        stoneDistance.push(new StoneScore(4, 'blue_stone'));
        scoreService.setDistanceRed(10);
        scoreService.nearestStoneIsBlue(stoneDistance);
        expect(scoreService.getScoreBlue()).to.equal(1);
    });

    it('Score blue should be 0', function () {
        scoreService.emptyArrayTest(stoneDistance);
        scoreService.setScoreBlue(0);
        stoneDistance.push(new StoneScore(4, 'blue_stone'));
        scoreService.setDistanceRed(1);
        scoreService.nearestStoneIsBlue(stoneDistance);
        expect(scoreService.getScoreBlue()).to.equal(0);
    });

    it('Score red should be 1', function () {
        scoreService.emptyArrayTest(stoneDistance);
        scoreService.setScoreRed(0);
        stoneDistance.push(new StoneScore(4, 'blue_stone'));
        stoneDistance.push(new StoneScore(2, 'red_stone'));
        scoreService.setDistanceBlue(4);
        scoreService.nearestStoneIsRed(stoneDistance);
        expect(scoreService.getScoreRed()).to.equal(1);
    });

    it('Score red should be 2', function () {
        scoreService.emptyArrayTest(stoneDistance);
        scoreService.setScoreRed(0);
        stoneDistance.push(new StoneScore(4, 'blue_stone'));
        stoneDistance.push(new StoneScore(2, 'red_stone'));
        stoneDistance.push(new StoneScore(2.5, 'red_stone'));
        scoreService.setDistanceBlue(4);
        scoreService.nearestStoneIsRed(stoneDistance);
        expect(scoreService.getScoreRed()).to.equal(2);
    });

    it('Score blue should be 1', function () {
        scoreService.emptyArrayTest(stoneDistance);
        scoreService.setScoreBlue(0);
        stoneDistance.push(new StoneScore(4, 'blue_stone'));
        stoneDistance.push(new StoneScore(6, 'red_stone'));
        stoneDistance.push(new StoneScore(5, 'red_stone'));
        scoreService.setDistanceRed(5);
        scoreService.nearestStoneIsBlue(stoneDistance);
        expect(scoreService.getScoreBlue()).to.equal(1);
    });

});

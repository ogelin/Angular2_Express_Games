import { EndGameService } from '../services/end-game.service';
import { ScoreService } from '../services/score.service';
import { PlayerService } from '../services/player.service';

import { expect, assert } from 'chai';
import * as SinonChai from 'sinon-chai';
chai.use(SinonChai);

describe('EndGameService', () => {
    let playerService: PlayerService;
    let scoreService: ScoreService;
    let endGameService: EndGameService;
    let stone1 = new THREE.Object3D();

    beforeEach(function () {
        endGameService = new EndGameService(scoreService, playerService);
    });

    it('Should always pass', function () {
        assert.isTrue(true);
    });

    it('Position stone should be -15', function () {
        stone1.position.y = -10;
        endGameService.stoneDown(stone1);
        expect(stone1.position.y).to.equal(-15);
    });

    it('Position stone should be -20', function () {
        stone1.position.y = -20;
        endGameService.stoneDown(stone1);
        expect(stone1.position.y).to.equal(-20);
    });

    it('Position stone should be -15', function () {
        stone1.position.y = -10;
        endGameService.stoneUp(stone1);
        expect(stone1.position.y).to.equal(-10);
    });

    it('Position stone should be -15', function () {
        stone1.position.y = -15;
        endGameService.stoneUp(stone1);
        expect(stone1.position.y).to.equal(-10);
    });

});

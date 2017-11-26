import { assert, expect } from 'chai';

import { ScoreBD } from '../classes/scoreBD';

describe('Testing ScoreBD', () => {
    let scoreBD: ScoreBD;

    it('Should has null scoreBD', function () {
        scoreBD = new ScoreBD(null, null, null);
        assert.isTrue(scoreBD.id === null && scoreBD.score === null && scoreBD.usernamePlayer === null);
    });

    it('scoreBD.id shoud not be null', function () {
        scoreBD.id = 1;
        assert.isTrue(scoreBD.id !== null);
    });

    it('scoreBD.id shoud  be 1', function () {
        expect(scoreBD.id).to.be.equal(1);
    });

    it('scoreBD.score shoud not be null', function () {
        scoreBD.score = '00 10';
        assert.isTrue(scoreBD.id !== null);
    });

    it('scoreBD.score shoud  be 00 10', function () {
        expect(scoreBD.score).to.be.equal('00 10');
    });

    it('scoreBD.usernamePlayer shoud not be null', function () {
        scoreBD.usernamePlayer = 'equipe7';
        assert.isTrue(scoreBD.usernamePlayer !== null);
    });

    it('scoreBD.usernamePlayer shoud  be equipe7', function () {
        expect(scoreBD.usernamePlayer).to.be.equal('equipe7');
    });
});

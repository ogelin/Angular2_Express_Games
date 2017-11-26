import { assert, expect } from 'chai';

import { Player } from '../classes/player';

describe('Testing Player', () => {
    let player: Player;

    it('Should has null player', function () {
        player = new Player(null);
        assert.isTrue(player.username === null);
    });

    it('player shoud not be null', function () {
        player.username = 'allo';
        assert.isTrue(player.username !== null);
    });

    it('player name  shoud  be allo', function () {
        expect(player.username).to.be.equal('allo');
    });
});

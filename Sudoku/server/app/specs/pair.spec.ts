import { assert, expect } from 'chai';

import { Pair } from '../classes/pair';

describe('Testing Pair', () => {
    let pair: Pair;

    it('Should has null pair', function () {
        pair = new Pair(null, null);
        assert.isTrue(pair.col === null && pair.row === null);
    });

    it('pair.col shoud not be null', function () {
        pair = new Pair(5, 10);
        assert.isTrue(pair.col !== null);
    });

    it('pair.col shoud  be equal 10', function () {
        expect(pair.col).to.be.equal(10);
    });

    it('pair.row shoud not be null', function () {
        assert.isTrue(pair.row !== null);
    });

    it('pair.row shoud  be equal 5', function () {
        expect(pair.row).to.be.equal(5);
    });
});

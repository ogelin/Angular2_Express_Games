import { puzzle } from '../classes/mock-scrabble';

import { expect } from 'chai';

describe('GridInterface', function () {

    it('Verifie qu aucune case du PUZZLE n est null', function () {
        let found = 0;
        for (let row of puzzle) {
            for (let value of row.letters) {
                if (value.value === null) {
                    found++;
                }
            }
        }
        expect(found).to.equal(0);
    });

});

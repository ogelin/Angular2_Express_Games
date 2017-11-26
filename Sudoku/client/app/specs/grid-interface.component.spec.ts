import { PUZZLE } from '../class/mock-sudoku';

import { expect } from 'chai';

describe('GridInterface', function () {

    it('Verifie qu aucune case du PUZZLE n est null', function () {
        let found = 0;
        for (let gridRow of PUZZLE) {
            for (let value of gridRow.rowValue) {
                if (value.value === null) {
                    found++;
                }
            }
        }
        expect(found).to.equal(0);
    });

    it('Ajoute de case null a chaque fois qu on trouve 1, 5, 9', function () {
        for (let gridRow of PUZZLE) {
            for (let value of gridRow.rowValue) {
                if (value.value === 1 || value.value === 5 || value.value === 9) {
                    value.value = null;
                    value.isReadOnly = false;
                }
            }
        }

        let found = 0;
        for (let gridRow of PUZZLE) {
            for (let value of gridRow.rowValue) {
                if (value.value === null) {
                    found++;
                }
            }
        }
        expect(found).to.not.equals(0);
    });

    it('Rempli les case null de 0', function () {
        for (let gridRow of PUZZLE) {
            for (let value of gridRow.rowValue) {
                if (value.value === null) {
                    value.value = 0;
                }
            }
        }

        let found = 0;
        for (let gridRow of PUZZLE) {
            for (let value of gridRow.rowValue) {
                if (value.value === 0) {
                    found++;
                }
            }
        }
        expect(found).to.not.equals(0);
    });

});

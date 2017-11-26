import { assert } from 'chai';

import { GridRow, RowValue } from '../classes/gridRow';
import { PUZZLE } from '../data/sudoku-data';

describe('Testing GridRow', () => {
    let gridRow: GridRow;
    let arrayRowValue: Array<RowValue> = [];
    let arrayGridRow: Array<GridRow>;

    beforeEach(function () {
        gridRow = new GridRow(arrayRowValue);
    });

    it('Should has an empty rowValue', function () {
        assert.isTrue(gridRow.rowValue.length === 0);
    });

    it('Should create  and return an array of RowValue', function () {
        arrayGridRow = gridRow.createGrid(PUZZLE);
        assert.isTrue(arrayGridRow.length !== 0);
    });

    it('The array created should have 9 rows', function () {
        assert.isTrue(arrayGridRow.length === 9);
    });

    it('The array created should have 9 colonnes', function () {
        assert.isTrue(arrayGridRow[0].rowValue.length === 9);
    });

    it('The array created should  have 82 element != 0', function () {
        let count = 0;
        for (let itemRows of arrayGridRow) {
            for (let itemCols of itemRows.rowValue) {
                if (itemCols.value !== 0) {
                    count++;
                }
            }
        }
        assert.isTrue(count === 81);
    });

    it('All elements in the created array should be readOnly', function () {
        let count = 0;
        for (let itemRows of arrayGridRow) {
            for (let itemCols of itemRows.rowValue) {
                if (itemCols.isReadOnly === true) {
                    count++;
                }
            }
        }
        assert.isTrue(count === 81);
    });

    it('The created array should have the same elements number has PUZZLE', function () {
        let index = 0, count = 0;
        for (let itemRows of arrayGridRow) {
            for (let itemCols of itemRows.rowValue) {
                if (itemCols.value === PUZZLE[index++]) {
                    count++;
                }
            }
        }
        assert.isTrue(count === 81);
    });
});

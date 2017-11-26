import { expect } from 'chai';
import { GridRow, RowValue } from '../classes/gridRow';
import { Remover } from '../services/caseRemover';
import { PUZZLE } from '../data/puzzle-data';

describe('Testing the case remover... ', () => {
    let testGrid: Array<GridRow>;
    let remover: Remover = new Remover();

    function createGrid(): void {
        let index = 0;
        testGrid = new Array<GridRow>();
        for (let row = 0; row < 9; row++) {
            testGrid.push(new GridRow([]));
            for (let col = 0; col < 9; col++) {
                testGrid[row].rowValue.push(new RowValue(PUZZLE[index]));
                index++;
            }
        }
    }

    beforeEach(function () {
        createGrid();
    });

    it('putZero should remove one box', function () {
        let comparisonGrid = new Array<GridRow>();
        let removedGrid = new Array<GridRow>();

        for (let i = 0; i < 9; i++) {
            comparisonGrid.push(new GridRow([]));
            removedGrid.push(new GridRow([]));
            for (let j = 0; j < 9; j++) {
                comparisonGrid[i].rowValue.push(new RowValue(testGrid[i].rowValue[j].value,
                    (testGrid[i].rowValue[j].isReadOnly)));
                removedGrid[i].rowValue.push(new RowValue(testGrid[i].rowValue[j].value,
                    (testGrid[i].rowValue[j].isReadOnly)));

            }
        }

        let differences = 0;
        remover.putZero(removedGrid);
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (comparisonGrid[i].rowValue[j].value !== removedGrid[i].rowValue[j].value) {
                    differences++;
                }
            }
        }
        expect(differences).to.equal(1);
    });

    it('putZero should remove more than one box', function () {
        let comparisonGrid = new Array<GridRow>();
        let removedGrid = new Array<GridRow>();

        let differences = 0;

        for (let i = 0; i < 9; i++) {
            comparisonGrid.push(new GridRow([]));
            removedGrid.push(new GridRow([]));
            for (let j = 0; j < 9; j++) {
                comparisonGrid[i].rowValue.push(new RowValue(testGrid[i].rowValue[j].value,
                    (testGrid[i].rowValue[j].isReadOnly)));
                removedGrid[i].rowValue.push(new RowValue(testGrid[i].rowValue[j].value,
                    (testGrid[i].rowValue[j].isReadOnly)));
            }
        }

        for (let i = 0; i < 81; i++) {
            remover.putZero(removedGrid);
        }
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (comparisonGrid[i].rowValue[j].value !== removedGrid[i].rowValue[j].value) {
                    differences++;
                }
            }
        }
        expect(differences).to.be.greaterThan(0);
    });

    it('should generate a random number', function () {
        let nb = remover.randomNumber(0, 9);
        expect(nb).to.be.oneOf([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });
});

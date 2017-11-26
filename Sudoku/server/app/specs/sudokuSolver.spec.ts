import { assert, expect } from 'chai';
import { GridRow, RowValue } from '../classes/gridRow';
import { Solver } from '../services/sudokuSolver';
import { Pair } from '../classes/pair';
import { PUZZLE } from '../data/puzzle-data';

describe('Testing the sudoku solver... ', () => {
    let testGrid: Array<GridRow>;
    let solver: Solver = new Solver();

    function createGrid(puzzleCopy: number[], rowMax?: number, ): Array<GridRow> {
        rowMax = (rowMax === undefined) ? 9 : rowMax;

        let index = 0;
        let gridCopy = new Array<GridRow>();
        for (let row = 0; row < rowMax; row++) {
            gridCopy.push(new GridRow([]));
            for (let col = 0; col < 9; col++) {
                gridCopy[row].rowValue.push(new RowValue(puzzleCopy[index]));
                index++;
            }
        }

        return gridCopy;
    }

    beforeEach(function () {
        testGrid = createGrid(PUZZLE, 8);
    });

    it('Should have a unique solution (when missing one zero)', function () {

        const puzzleCopie = [
            0, 2, 3, 4, 5, 6, 7, 8, 9,
            4, 5, 6, 7, 8, 9, 1, 2, 3,
            7, 8, 9, 1, 2, 3, 4, 5, 6,
            2, 3, 4, 5, 6, 7, 8, 9, 1,
            5, 6, 7, 8, 9, 1, 2, 3, 4,
            8, 9, 1, 2, 3, 4, 5, 6, 7,
            3, 4, 5, 6, 7, 8, 9, 1, 2,
            6, 7, 8, 9, 1, 2, 3, 4, 5,
            9, 1, 2, 3, 4, 5, 6, 7, 8,
        ];


        let singleSolution = createGrid(puzzleCopie);
        solver.solCount = 0;

        assert.isTrue(solver.solUnique(0, 0, singleSolution));
    });

    it('Should have a unique solution (when first row is zeroes)', function () {

        const puzzleCopie = [
            0, 0, 0, 0, 0, 0, 0, 0, 0,
            4, 5, 6, 7, 8, 9, 1, 2, 3,
            7, 8, 9, 1, 2, 3, 4, 5, 6,
            2, 3, 4, 5, 6, 7, 8, 9, 1,
            5, 6, 7, 8, 9, 1, 2, 3, 4,
            8, 9, 1, 2, 3, 4, 5, 6, 7,
            3, 4, 5, 6, 7, 8, 9, 1, 2,
            6, 7, 8, 9, 1, 2, 3, 4, 5,
            9, 1, 2, 3, 4, 5, 6, 7, 8,
        ];


        let singleSolution = createGrid(puzzleCopie);

        solver.solCount = 0;

        assert.isTrue(solver.solUnique(0, 0, singleSolution));
    });

    it('Should have a unique solution (when first column is zero)', function () {

        const puzzleCopie = [
            0, 2, 3, 4, 5, 6, 7, 8, 9,
            0, 5, 6, 7, 8, 9, 1, 2, 3,
            0, 8, 9, 1, 2, 3, 4, 5, 6,
            0, 3, 4, 5, 6, 7, 8, 9, 1,
            0, 6, 7, 8, 9, 1, 2, 3, 4,
            0, 9, 1, 2, 3, 4, 5, 6, 7,
            0, 4, 5, 6, 7, 8, 9, 1, 2,
            0, 7, 8, 9, 1, 2, 3, 4, 5,
            0, 1, 2, 3, 4, 5, 6, 7, 8,
        ];

        let singleSolution = createGrid(puzzleCopie);

        solver.solCount = 0;

        assert.isTrue(solver.solUnique(0, 0, singleSolution));

    });

    it('Should try the input', function () {

        const puzzleCopie = [
            1, 2, 3, 4, 5, 6, 7, 8, 9,
            0, 5, 6, 7, 8, 9, 1, 2, 3,
            0, 8, 9, 1, 2, 3, 4, 5, 6,
            0, 3, 4, 5, 6, 7, 8, 9, 1,
            0, 6, 7, 8, 9, 1, 2, 3, 4,
            0, 9, 1, 2, 3, 4, 5, 6, 7,
            0, 4, 5, 6, 7, 8, 9, 1, 2,
            0, 7, 8, 9, 1, 2, 3, 4, 5,
            0, 1, 2, 3, 4, 5, 6, 7, 8,
        ];

        let sudo = createGrid(puzzleCopie);

        assert.isTrue(solver.canTryInput(4, new Pair(1, 0), sudo));
    });


    it('Should not try the input', function () {

        const puzzleCopie = [
            1, 2, 3, 4, 5, 6, 7, 8, 9,
            0, 5, 6, 7, 8, 9, 1, 2, 3,
            0, 8, 9, 1, 2, 3, 4, 5, 6,
            0, 3, 4, 5, 6, 7, 8, 9, 1,
            0, 6, 7, 8, 9, 1, 2, 3, 4,
            0, 9, 1, 2, 3, 4, 5, 6, 7,
            0, 4, 5, 6, 7, 8, 9, 1, 2,
            0, 7, 8, 9, 1, 2, 3, 4, 5,
            0, 1, 2, 3, 4, 5, 6, 7, 8,
        ];

        let sudo = createGrid(puzzleCopie);

        assert.isFalse(solver.canTryInput(5, new Pair(0, 1), sudo));

    });

    it('Should not contain the input in box', function () {

        const puzzleCopie = [
            1, 2, 3, 4, 5, 6, 7, 8, 9,
            0, 5, 6, 7, 8, 9, 1, 2, 3,
            0, 8, 9, 1, 2, 3, 4, 5, 6,
            0, 3, 4, 5, 6, 7, 8, 9, 1,
            0, 6, 7, 8, 9, 1, 2, 3, 4,
            0, 9, 1, 2, 3, 4, 5, 6, 7,
            0, 4, 5, 6, 7, 8, 9, 1, 2,
            0, 7, 8, 9, 1, 2, 3, 4, 5,
            0, 1, 2, 3, 4, 5, 6, 7, 8,
        ];

        let sudo = createGrid(puzzleCopie);

        assert.isFalse(solver.containsInputInBox(4, new Pair(0, 1), sudo));

    });

    it('Should not find input in row', function () {

        const puzzleCopie = [
            1, 2, 3, 4, 5, 6, 7, 8, 9,
            0, 5, 6, 7, 8, 9, 1, 2, 3,
            0, 8, 9, 1, 2, 3, 4, 5, 6,
            0, 3, 4, 5, 6, 7, 8, 9, 1,
            0, 6, 7, 8, 9, 1, 2, 3, 4,
            0, 9, 1, 2, 3, 4, 5, 6, 7,
            0, 4, 5, 6, 7, 8, 9, 1, 2,
            0, 7, 8, 9, 1, 2, 3, 4, 5,
            0, 1, 2, 3, 4, 5, 6, 7, 8,
        ];

        let sudo = createGrid(puzzleCopie);

        assert.isFalse(solver.containsInputInRow(4, 1, sudo));

    });

    it('Should not find input in column', function () {

        const puzzleCopie = [
            1, 2, 3, 4, 5, 6, 7, 8, 9,
            0, 5, 6, 7, 8, 9, 1, 2, 3,
            0, 8, 9, 1, 2, 3, 4, 5, 6,
            0, 3, 4, 5, 6, 7, 8, 9, 1,
            0, 6, 7, 8, 9, 1, 2, 3, 4,
            0, 9, 1, 2, 3, 4, 5, 6, 7,
            0, 4, 5, 6, 7, 8, 9, 1, 2,
            0, 7, 8, 9, 1, 2, 3, 4, 5,
            0, 1, 2, 3, 4, 5, 6, 7, 8,
        ];

        let sudo = createGrid(puzzleCopie);

        assert.isFalse(solver.containsInputInCol(4, 0, sudo));

    });

    it('Should find input in row', function () {
        const puzzleCopie = [
            1, 2, 3, 4, 5, 6, 7, 8, 9,
            0, 5, 6, 7, 8, 9, 1, 2, 3,
            0, 8, 9, 1, 2, 3, 4, 5, 6,
            0, 3, 4, 5, 6, 7, 8, 9, 1,
            0, 6, 7, 8, 9, 1, 2, 3, 4,
            0, 9, 1, 2, 3, 4, 5, 6, 7,
            0, 4, 5, 6, 7, 8, 9, 1, 2,
            0, 7, 8, 9, 1, 2, 3, 4, 5,
            0, 1, 2, 3, 4, 5, 6, 7, 8,
        ];

        let sudo = createGrid(puzzleCopie);

        assert.isTrue(solver.containsInputInRow(9, 2, sudo));

    });

    it('Should find input in col', function () {

        const puzzleCopie = [
            1, 2, 3, 4, 5, 6, 7, 8, 9,
            0, 5, 6, 7, 8, 9, 1, 2, 3,
            0, 8, 9, 1, 2, 3, 4, 5, 6,
            0, 3, 4, 5, 6, 7, 8, 9, 1,
            0, 6, 7, 8, 9, 1, 2, 3, 4,
            0, 9, 1, 2, 3, 4, 5, 6, 7,
            0, 4, 5, 6, 7, 8, 9, 1, 2,
            0, 7, 8, 9, 1, 2, 3, 4, 5,
            0, 1, 2, 3, 4, 5, 6, 7, 8,
        ];

        let sudo = createGrid(puzzleCopie);

        assert.isTrue(solver.containsInputInRow(4, 4, sudo));

    });

    it('Should find a solution (all filled)', function () {

        let singleSolution = createGrid(PUZZLE);

        expect(solver.solUnique(0, 0, singleSolution)).to.equal(true);

    });

    it('Should be allowed to place a 1', function () {

        const puzzleCopie = [
            0, 2, 3, 4, 5, 6, 7, 8, 9,
            4, 5, 6, 7, 8, 9, 1, 2, 3,
            7, 8, 9, 1, 2, 3, 4, 5, 6,
            2, 3, 4, 5, 6, 7, 8, 9, 1,
            5, 6, 7, 8, 9, 1, 2, 3, 4,
            8, 9, 1, 2, 3, 4, 5, 6, 7,
            3, 4, 5, 6, 7, 8, 9, 1, 2,
            6, 7, 8, 9, 1, 2, 3, 4, 5,
            9, 1, 2, 3, 4, 5, 6, 7, 8,
        ];

        let missingOne = createGrid(puzzleCopie);

        assert.deepEqual(true, solver.canTryInput(1, new Pair(0, 0), missingOne));
    });

    it('Should be allowed to place a 9', function () {

        const puzzleCopie = [
            1, 2, 3, 4, 5, 6, 7, 8, 9,
            4, 5, 6, 7, 8, 9, 1, 2, 3,
            7, 8, 9, 1, 2, 3, 4, 5, 6,
            2, 3, 4, 5, 6, 7, 8, 0, 1,
            5, 6, 7, 8, 9, 1, 2, 3, 4,
            8, 9, 1, 2, 3, 4, 5, 6, 7,
            3, 4, 5, 6, 7, 8, 9, 1, 2,
            6, 7, 8, 9, 1, 2, 3, 4, 5,
            9, 1, 2, 3, 4, 5, 6, 7, 8,
        ];

        let missingOne = createGrid(puzzleCopie);

        assert.deepEqual(true, solver.canTryInput(9, new Pair(3, 7), missingOne));
    });

    it('Should not be allowed to place a 9', function () {

        let missingOne = createGrid(PUZZLE);

        assert.deepEqual(false, solver.canTryInput(9, new Pair(3, 7), missingOne));
    });

    it('Should find a 1 in column 0', function () {

        let testSudoku = createGrid(PUZZLE);

        assert.deepEqual(true, solver.containsInputInCol(1, 0, testSudoku));

    });

    it('Should find a 3 in column 2', function () {

        let testSudoku = createGrid(PUZZLE);
        assert.deepEqual(true, solver.containsInputInCol(3, 2, testSudoku));

    });

    it('Should find a 0 in column 8', function () {
        const puzzleCopie = [
            1, 2, 3, 4, 5, 6, 7, 8, 9,
            4, 5, 6, 7, 8, 9, 1, 2, 3,
            7, 8, 9, 1, 2, 3, 4, 5, 6,
            2, 3, 4, 5, 6, 7, 8, 9, 1,
            5, 6, 7, 8, 9, 1, 2, 3, 4,
            8, 9, 1, 2, 3, 4, 5, 6, 7,
            3, 4, 5, 6, 7, 8, 9, 1, 2,
            6, 7, 8, 9, 1, 2, 3, 4, 5,
            9, 1, 2, 3, 4, 5, 6, 7, 0,
        ];


        let testSudoku = createGrid(puzzleCopie);

        assert.deepEqual(true, solver.containsInputInCol(0, 8, testSudoku));

    });

    it('should find a 9 in row 3,', function () {
        const puzzleCopie = [
            1, 2, 3, 4, 5, 6, 7, 8, 9,
            4, 5, 6, 7, 8, 9, 1, 2, 3,
            7, 8, 9, 1, 2, 3, 4, 5, 6,
            2, 3, 4, 5, 6, 7, 8, 9, 1,
            5, 6, 7, 8, 9, 1, 2, 3, 4,
            8, 9, 1, 2, 3, 4, 5, 6, 7,
            3, 4, 5, 6, 7, 8, 9, 1, 2,
            6, 7, 8, 9, 1, 2, 3, 4, 5,
            9, 1, 2, 3, 4, 5, 6, 7, 0,
        ];

        let testSudoku = createGrid(puzzleCopie);

        assert.deepEqual(true, solver.containsInputInRow(9, 3, testSudoku));

    });

    it('should find a 0 in row 8,', function () {
        const puzzleCopie = [
            1, 2, 3, 4, 5, 6, 7, 8, 9,
            4, 5, 6, 7, 8, 9, 1, 2, 3,
            7, 8, 9, 1, 2, 3, 4, 5, 6,
            2, 3, 4, 5, 6, 7, 8, 9, 1,
            5, 6, 7, 8, 9, 1, 2, 3, 4,
            8, 9, 1, 2, 3, 4, 5, 6, 7,
            3, 4, 5, 6, 7, 8, 9, 1, 2,
            6, 7, 8, 9, 1, 2, 3, 4, 5,
            9, 1, 2, 3, 4, 5, 6, 7, 0,
        ];

        let testSudoku = createGrid(puzzleCopie);

        assert.deepEqual(true, solver.containsInputInRow(0, 8, testSudoku));

    });
    it('Should find a 1 in row 0', function () {


        let testSudoku = createGrid(PUZZLE);

        assert.deepEqual(true, solver.containsInputInCol(1, 0, testSudoku));

    });

    it('Should find a 1 in box 0', function () {

        let testSudoku = createGrid(PUZZLE);

        expect(solver.containsInputInBox(1, new Pair(0, 0), testSudoku)).to.equal(true);

    });

    it('Should find a 8 in box 9', function () {

        let testSudoku = createGrid(PUZZLE);

        expect(solver.containsInputInBox(8, new Pair(8, 8), testSudoku)).to.equal(true);

    });

    it('Should find a 5 in box 3', function () {

        let testSudoku = createGrid(PUZZLE);
        expect(solver.containsInputInBox(5, new Pair(1, 7), testSudoku)).to.equal(true);

    });



    it('Should  add one', function () {

        expect(solver.testFunction(1)).to.equal(2);

    });
    it('Should find three zeroes', function () {

        const puzzleCopie = [
            0, 2, 3, 4, 5, 6, 7, 8, 9,
            0, 0, 6, 7, 8, 9, 1, 2, 3,
            7, 8, 9, 1, 2, 3, 4, 5, 6,
            2, 3, 4, 5, 6, 7, 8, 9, 1,
            5, 6, 7, 8, 9, 1, 2, 3, 4,
            8, 9, 1, 2, 3, 4, 5, 6, 7,
            3, 4, 5, 6, 7, 8, 9, 1, 2,
            6, 7, 8, 9, 1, 2, 3, 4, 5,
            9, 1, 2, 3, 4, 5, 6, 7, 8,
        ];


        let testSudoku = createGrid(puzzleCopie);

        expect(solver.countZeros(testSudoku)).to.equal(3);
    });
    it('Should find 81 zeroes', function () {

        const puzzleCopie = [
            0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0,
        ];

        let testSudoku = createGrid(puzzleCopie);

        expect(solver.countZeros(testSudoku)).to.equal(81);


    });



    it('Should find a zero', function () {

        const puzzleCopie = [
            0, 2, 3, 4, 5, 6, 7, 8, 9,
            0, 0, 6, 7, 8, 9, 1, 2, 3,
            7, 8, 9, 1, 2, 3, 4, 5, 6,
            2, 3, 4, 5, 6, 7, 8, 9, 1,
            5, 6, 7, 8, 9, 1, 2, 3, 4,
            8, 9, 1, 2, 3, 4, 5, 6, 7,
            3, 4, 5, 6, 7, 8, 9, 1, 2,
            6, 7, 8, 9, 1, 2, 3, 4, 5,
            9, 1, 2, 3, 4, 5, 6, 7, 8,
        ];


        let testSudoku = createGrid(puzzleCopie);

        expect(solver.getInput(new Pair(0, 0), testSudoku)).to.equal(0);


    });

    it('Should not modify the original grid ', function () {

        let originalGrid = createGrid(PUZZLE);
        let comparisonGrid = createGrid(PUZZLE);

        solver.solUnique(0, 0, originalGrid);
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                assert.deepEqual(originalGrid[i].rowValue[j], comparisonGrid[i].rowValue[j]);
            }
        }
    });

    it('Should return true to having unique solution (first test Grid) ', function () {

        const puzzleCopie = [
            0, 0, 0, 2, 0, 7, 0, 4, 0,
            5, 0, 0, 4, 0, 0, 0, 0, 6,
            3, 0, 4, 0, 0, 0, 0, 9, 2,
            0, 1, 0, 0, 0, 4, 6, 0, 0,
            2, 0, 0, 0, 6, 0, 0, 5, 1,
            0, 9, 3, 0, 0, 1, 2, 0, 0,
            7, 0, 6, 0, 0, 0, 0, 2, 0,
            0, 8, 0, 9, 3, 0, 0, 0, 0,
            1, 5, 0, 6, 0, 0, 4, 8, 0,
        ];

        let uniqueSolution = createGrid(puzzleCopie);

        expect(solver.hasUniqueSolution(uniqueSolution)).to.be.true;

    });

    it('Should detect multiple solutions (2nd test Grid) ', function () {

        const puzzleCopie = [
            8, 5, 2, 0, 0, 1, 0, 0, 0,
            6, 3, 9, 5, 0, 0, 0, 0, 0,
            7, 4, 0, 6, 3, 0, 0, 8, 0,
            0, 6, 3, 8, 0, 2, 7, 1, 0,
            0, 0, 4, 9, 6, 3, 0, 0, 0,
            0, 0, 0, 1, 0, 0, 9, 3, 6,
            0, 2, 8, 4, 0, 7, 0, 0, 0,
            0, 1, 7, 3, 0, 0, 2, 0, 0,
            3, 0, 6, 0, 8, 0, 1, 4, 7,
        ];

        let nonUniqueSolution = createGrid(puzzleCopie);
        expect(solver.hasUniqueSolution(nonUniqueSolution)).to.be.false;

    });

    it('Should return false to having unique solution (third test Grid.. Only 1st row nonzero) ', function () {


        const puzzleCopie = [
            1, 2, 3, 4, 5, 6, 7, 8, 9,
            0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0,
        ];

        let uniqueSolution = createGrid(puzzleCopie);
        expect(solver.solUnique(0, 0, uniqueSolution)).to.be.false;

    });

    it('Should return location of first zero) ', function () {
        const puzzleCopie = [
            1, 2, 3, 4, 5, 6, 7, 8, 9,
            4, 5, 6, 7, 8, 9, 1, 2, 3,
            7, 8, 9, 1, 2, 0, 4, 5, 6,
            2, 3, 4, 5, 6, 7, 8, 9, 1,
            5, 6, 7, 8, 9, 1, 2, 3, 4,
            8, 9, 1, 2, 3, 4, 5, 6, 7,
            3, 4, 5, 6, 7, 8, 9, 1, 2,
            6, 7, 8, 9, 1, 2, 3, 4, 5,
            9, 1, 2, 3, 4, 5, 6, 7, 8,
        ];

        let firstZero = createGrid(puzzleCopie);

        expect(solver.findFirstZeroIndex(firstZero).row).to.equal(2);
        expect(solver.findFirstZeroIndex(firstZero).col).to.equal(5);
    });



});

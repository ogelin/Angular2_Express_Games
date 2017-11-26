import { assert, expect } from 'chai';
import { GridRow, RowValue } from '../classes/gridRow';
import { NORMAL_SUDOKU_SOLUTIONS } from '../data/sudoku-data';
import { NORMAL_EMPTY_SUDOKUS } from '../data/sudoku-data';
import { DIFFICULT_SUDOKU_SOLUTIONS } from '../data/sudoku-data';
import { DIFFICULT_EMPTY_SUDOKUS } from '../data/sudoku-data';
import { Solver } from '../services/sudokuSolver';
import * as GridManagerService from '../services/grid-manager.service';


describe('Verifier la generation de la grille ', () => {
    let newGrid: GridManagerService.GridManager;
    let grid: Array<GridRow>;
    let solver: Solver;

    const testGrid = [
        1, 2, 3, 4, 5, 6, 7, 8, 9,
        4, 5, 6, 7, 8, 9, 1, 2, 3,
        7, 8, 9, 1, 2, 3, 4, 5, 6,
        2, 3, 4, 5, 6, 7, 8, 9, 1,
        5, 6, 7, 8, 9, 1, 2, 3, 4,
        8, 9, 1, 2, 3, 4, 5, 6, 7,
        3, 4, 5, 6, 7, 8, 9, 1, 2,
        6, 7, 8, 9, 1, 2, 3, 4, 5,
        9, 1, 2, 3, 4, 5, 6, 7, 8,
    ];

    beforeEach(function () {
        newGrid = GridManagerService.GridManager.getInstance();
        solver = new Solver();
        grid = newGrid.createGrid(testGrid);

        /* empty data grids before each test*/
        while (NORMAL_SUDOKU_SOLUTIONS.length !== 0) {
            NORMAL_SUDOKU_SOLUTIONS.pop();
        }
        while (NORMAL_EMPTY_SUDOKUS.length !== 0) {
            NORMAL_EMPTY_SUDOKUS.pop();
        }
        while (DIFFICULT_SUDOKU_SOLUTIONS.length !== 0) {
            DIFFICULT_SUDOKU_SOLUTIONS.pop();
        }
        while (DIFFICULT_EMPTY_SUDOKUS.length !== 0) {
            DIFFICULT_EMPTY_SUDOKUS.pop();
        }
    });

    it('Should make the number table into our sudoku array format', function () {
        let sudoku = [new GridRow([new RowValue(1), new RowValue(2), new RowValue(3),
        new RowValue(4), new RowValue(5), new RowValue(6),
        new RowValue(7), new RowValue(8), new RowValue(9)]),
        new GridRow([new RowValue(4), new RowValue(5), new RowValue(6),
        new RowValue(7), new RowValue(8), new RowValue(9),
        new RowValue(1), new RowValue(2), new RowValue(3)]),
        new GridRow([new RowValue(7), new RowValue(8), new RowValue(9),
        new RowValue(1), new RowValue(2), new RowValue(3),
        new RowValue(4), new RowValue(5), new RowValue(6)]),
        new GridRow([new RowValue(2), new RowValue(3), new RowValue(4),
        new RowValue(5), new RowValue(6), new RowValue(7),
        new RowValue(8), new RowValue(9), new RowValue(1)]),
        new GridRow([new RowValue(5), new RowValue(6), new RowValue(7),
        new RowValue(8), new RowValue(9), new RowValue(1),
        new RowValue(2), new RowValue(3), new RowValue(4)]),
        new GridRow([new RowValue(8), new RowValue(9), new RowValue(1),
        new RowValue(2), new RowValue(3), new RowValue(4),
        new RowValue(5), new RowValue(6), new RowValue(7)]),
        new GridRow([new RowValue(3), new RowValue(4), new RowValue(5),
        new RowValue(6), new RowValue(7), new RowValue(8),
        new RowValue(9), new RowValue(1), new RowValue(2)]),
        new GridRow([new RowValue(6), new RowValue(7), new RowValue(8),
        new RowValue(9), new RowValue(1), new RowValue(2),
        new RowValue(3), new RowValue(4), new RowValue(5)]),
        new GridRow([new RowValue(9), new RowValue(1), new RowValue(2),
        new RowValue(3), new RowValue(4), new RowValue(5),
        new RowValue(6), new RowValue(7), new RowValue(8)])];
        let otherSudoku = newGrid.createGrid(testGrid);

        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                expect(sudoku[i].rowValue[j].value).to.be.equal(otherSudoku[i].rowValue[j].value);
            }
        }
    });

    it('Should find the sudoku equals itself ', function () {
        expect(newGrid.areSameSudoku(grid, grid)).to.be.true;
    });

    it('Should find that the two sudokus are the same ', function () {
        let othergrid = new Array<GridRow>();
        for (let i = 0; i < 9; i++) {
            othergrid.push(new GridRow([]));
            for (let j = 0; j < 9; j++) {
                othergrid[i].rowValue.push(new RowValue(grid[i].rowValue[j].value));
            }
        }
        expect(newGrid.areSameSudoku(grid, othergrid)).to.be.true;
    });
    it('Should NOT change original grid when removing zeroes', function () {
        let othergrid = newGrid.copySudoku(grid);
        newGrid.removeZeroes(50, grid);
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                expect(grid[i].rowValue[j].value).to.be.equal(othergrid[i].rowValue[j].value);
            }
        }
    });

    it('Should find the unanswered sudoku corresponds to its solution grid', function () {
        let emptyGrid = newGrid.removeZeroes(50, grid);
        expect(newGrid.areSameSudoku(grid, emptyGrid)).to.be.true;
    });

    it('Should find an empty sudoku (all 0s) corresponds to any solution grid', function () {
        let emptyGrid = new Array<GridRow>();
        let comparisonGrid = newGrid.randomizer(newGrid.copySudoku(grid));
        for (let i = 0; i < 9; i++) {
            emptyGrid.push(new GridRow([]));
            for (let j = 0; j < 9; j++) {
                emptyGrid[i].rowValue.push(new RowValue(0));
            }
        }
        expect(newGrid.areSameSudoku(emptyGrid, comparisonGrid)).to.be.true;
    });

    it('Should copy the sudoku properly into another sudoku array', function () {
        let othergrid = new Array<GridRow>();
        othergrid = newGrid.copySudoku(grid);
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                expect(grid[i].rowValue[j].value).to.be.equal(othergrid[i].rowValue[j].value);
            }
        }
    });

    it('Should add a sudoku to the sudoku solutions data', function () {
        newGrid.loadSudokuData(NORMAL_SUDOKU_SOLUTIONS, NORMAL_EMPTY_SUDOKUS, 50);
        expect(NORMAL_SUDOKU_SOLUTIONS.length).to.equal(1);
    });

    it('Should add 3 sudokus to the sudoku solutions data', function () {
        newGrid.emptyData();
        newGrid.initalizeSudokuData(3);
        expect(NORMAL_SUDOKU_SOLUTIONS.length).to.be.equal(3);
    });

    it('Should add a sudoku to the unanswered sudoku  data', function () {
        newGrid.loadSudokuData(NORMAL_SUDOKU_SOLUTIONS, NORMAL_EMPTY_SUDOKUS, 50);
        expect(NORMAL_EMPTY_SUDOKUS.length).to.equal(1);
    });

    it('Should add 3 sudokus to the unanswered sudoku  data', function () {
        newGrid.initalizeSudokuData(3);
        expect(NORMAL_EMPTY_SUDOKUS.length).to.equal(3);
    });

    it('Should add 3 VALID sudokus to the unanswered sudoku  data', function () {
        for (let j = 0; j < 100; j++) {
            newGrid.emptyData();
            newGrid.initalizeSudokuData(3);
            for (let i = 0; i < NORMAL_EMPTY_SUDOKUS.length; i++) {
                expect(solver.hasUniqueSolution(NORMAL_EMPTY_SUDOKUS[i])).to.be.true;
            }
            for (let i = 0; i < DIFFICULT_EMPTY_SUDOKUS.length; i++) {
                expect(solver.hasUniqueSolution(DIFFICULT_EMPTY_SUDOKUS[i])).to.be.true;
            }
        }
    });

    it('Should add 3 VALID easy sudokus to the unanswered sudoku  data', function () {
        for (let j = 0; j < 100; j++) {
            newGrid.emptyData();
            newGrid.initalizeSudokuData(3);
            for (let i = 0; i < NORMAL_EMPTY_SUDOKUS.length; i++) {
                expect(solver.hasUniqueSolution(NORMAL_EMPTY_SUDOKUS[i])).to.be.true;
            }
        }
    });

    it('Should add 3 VALID  hard sudokus to the unanswered sudoku  data', function () {
        for (let j = 0; j < 100; j++) {
            newGrid.emptyData();
            newGrid.initalizeSudokuData(3);

            for (let i = 0; i < DIFFICULT_EMPTY_SUDOKUS.length; i++) {
                expect(solver.hasUniqueSolution(DIFFICULT_EMPTY_SUDOKUS[i])).to.be.true;
            }
        }
    });

    it('Should give the sudoku from the FIRST index in the data', function () {
        newGrid.emptyData();
        newGrid.initalizeSudokuData(3);
        let firstGrid = newGrid.copySudoku(NORMAL_EMPTY_SUDOKUS[0]);
        let secondGrid = newGrid.getSudoku("normal");
        expect(newGrid.areSameSudoku(firstGrid, secondGrid)).to.be.true;
    });

    it('Should replace the given sudoku at the LAST index in the data', function () {
        newGrid.emptyData();
        newGrid.initalizeSudokuData(3);
        let firstGrid = newGrid.copySudoku(NORMAL_EMPTY_SUDOKUS[2]);
        newGrid.getSudoku("normal");
        let newFirstGrid = newGrid.copySudoku(NORMAL_EMPTY_SUDOKUS[2]);
        expect(newGrid.areSameSudoku(firstGrid, newFirstGrid)).to.be.false;
    });

    it('Should NOT have empty sudoku data arrays after loading sudokus', function () {
        newGrid.initalizeSudokuData(3);
        expect(NORMAL_EMPTY_SUDOKUS.length).to.not.equal(0);
    });

    it('Should empty data', function () {
        newGrid.initalizeSudokuData(3);
        newGrid.emptyData();
        expect(NORMAL_EMPTY_SUDOKUS.length).to.equal(0);
        expect(DIFFICULT_EMPTY_SUDOKUS.length).to.equal(0);
        expect(DIFFICULT_SUDOKU_SOLUTIONS.length).to.equal(0);
        expect(NORMAL_SUDOKU_SOLUTIONS.length).to.equal(0);
    });

    it('Checking line inversion', function () {

        const puzzleCopie = [
            4, 5, 6, 7, 8, 9, 1, 2, 3,
            1, 2, 3, 4, 5, 6, 7, 8, 9,
            2, 3, 4, 5, 6, 7, 8, 9, 1,
            5, 6, 7, 8, 9, 1, 2, 3, 4,
            8, 9, 1, 2, 3, 4, 5, 6, 7,
            3, 4, 5, 6, 7, 8, 9, 1, 2,
            6, 7, 8, 9, 1, 2, 3, 4, 5,
            9, 1, 2, 3, 4, 5, 6, 7, 8,
        ];

        let expectedGrid: Array<GridRow>;
        expectedGrid = newGrid.createGrid(puzzleCopie, 8);

        let resultGrid = newGrid.swapRow(0, 1, grid);
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                assert.deepEqual(resultGrid[1].rowValue[j].value, expectedGrid[1].rowValue[j].value);
            }
        }
    });

    it('Checking column inversion', function () {

        const puzzleCopie = [
            5, 4, 6, 7, 8, 9, 1, 2, 3,
            2, 1, 3, 4, 5, 6, 7, 8, 9,
            3, 2, 4, 5, 6, 7, 8, 9, 1,
            6, 5, 7, 8, 9, 1, 2, 3, 4,
            9, 8, 1, 2, 3, 4, 5, 6, 7,
            4, 3, 5, 6, 7, 8, 9, 1, 2,
            7, 6, 8, 9, 1, 2, 3, 4, 5,
            1, 9, 2, 3, 4, 5, 6, 7, 8,
        ];

        let expectedGrid: Array<GridRow>;
        expectedGrid = newGrid.createGrid(puzzleCopie, 8);

        let resultGrid = newGrid.swapCol(0, 1, grid);
        for (let i = 0; i < 9; i++) {
            assert.deepEqual(resultGrid[0].rowValue[i].value, expectedGrid[1].rowValue[i].value);
        }
    });

    it('Checking column inversion', function () {

        const puzzleCopie = [
            5, 4, 6, 7, 8, 9, 1, 2, 3,
            2, 1, 3, 4, 5, 6, 7, 8, 9,
            3, 2, 4, 5, 6, 7, 8, 9, 1,
            6, 5, 7, 8, 9, 1, 2, 3, 4,
            9, 8, 1, 2, 3, 4, 5, 6, 7,
            4, 3, 5, 6, 7, 8, 9, 1, 2,
            7, 6, 8, 9, 1, 2, 3, 4, 5,
            1, 9, 2, 3, 4, 5, 6, 7, 8,
        ];

        let expectedGrid: Array<GridRow>;
        expectedGrid = newGrid.createGrid(puzzleCopie, 8);

        let resultGrid = newGrid.randomCol(0, 1, grid);
        for (let i = 0; i < 9; i++) {
            assert.deepEqual(resultGrid[0].rowValue[i].value, expectedGrid[1].rowValue[i].value);
        }
    });
});

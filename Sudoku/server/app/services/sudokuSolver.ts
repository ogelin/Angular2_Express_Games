import { GridRow, RowValue } from '../classes/gridRow';
import { Pair } from '../classes/pair';

export class Solver {

    solCount = 0;

    constructor() {//TODO
    }

    countZeros(sudoku: Array<GridRow>): number {
        let n = 0;
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.getInput(new Pair(i, j), sudoku) === 0) {
                    n++;
                }
            }
        }
        return n;
    }

    printSudoku(sudoku: Array<GridRow>): String {
        let sudo = "";

        for (let gridRow of sudoku) {
            for (let rowValue of gridRow.rowValue) {
                sudo = sudo + rowValue.value + ' ';
            }
            sudo += " \n";
        }

        return sudo;
    }

    solve(row: number, col: number, sudoku: Array<GridRow>): boolean {
        let pairFirstZero = this.findFirstZeroIndex(sudoku);
        row = pairFirstZero.row;
        col = pairFirstZero.col;

        // si tout le tableau est rempli
        if (row === -1) {
            return true;
        }

        for (let num = 1; num <= 9; num++) {
            if (this.canTryInput(num, new Pair(row, col), sudoku)) {
                sudoku[row].rowValue[col].value = num;
                if (this.solve(row, col, sudoku)) {
                    return true;
                }
                sudoku[row].rowValue[col].value = 0;
            }
        }
        return false;
    }
    //DO NOT CALL!!! WILL FILL SUDOKU WITH SOLUTION! AUSSI NE PAS RENDRE PRIVÉ CAR TESTS EN DÉPEND
    solUnique(row: number, col: number, sudoku: Array<GridRow>): boolean {
        let pairFirstZero = this.findFirstZeroIndex(sudoku);
        row = pairFirstZero.row;
        col = pairFirstZero.col;

        // si tout le tableau est rempli
        if (row === -1) {
            this.solCount++;
            return true;
        }

        for (let num = 1; num <= 9; num++) {
            if (this.canTryInput(num, new Pair(row, col), sudoku)) {
                sudoku[row].rowValue[col].value = num;
                this.solUnique(row, col, sudoku);
                if (this.solCount > 1) {
                    return false;
                }
                sudoku[row].rowValue[col].value = 0;
            }
        }
        return (this.solCount === 1);
    }

    hasUniqueSolution(sudo: Array<GridRow>): boolean {
        let sudoku = new Array<GridRow>();
        for (let row = 0; row < 9; row++) {
            sudoku.push(new GridRow([]));
            for (let col = 0; col < 9; col++) {
                sudoku[row].rowValue.push(new RowValue(sudo[row].rowValue[col].value));
            }
        }
        this.solCount = 0;
        return this.solUnique(0, 0, sudoku);
    }

    findFirstZeroIndex(sudoku: Array<GridRow>): Pair {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (sudoku[i].rowValue[j].value === 0) {
                    return new Pair(i, j);
                }
            }
        }
        return new Pair(-1, -1);
    }

    canTryInput(input: number, pair: Pair, sudoku: Array<GridRow>): boolean {

        return !(this.containsInputInRow(input, pair.row, sudoku))
            && !(this.containsInputInCol(input, pair.col, sudoku))
            && !(this.containsInputInBox(input, new Pair(pair.row, pair.col), sudoku));
    }

    containsInputInCol(input: number, col: number, sudoku: Array<GridRow>): boolean {
        for (let row = 0; row < 9; row++) {
            if (sudoku[row].rowValue[col].value === input) {
                return true;
            }
        }
        return false;
    }

    containsInputInRow(input: number, row: number, sudoku: Array<GridRow>): boolean {
        for (let col = 0; col < 9; col++) {
            if (sudoku[row].rowValue[col].value === input) {
                return true;
            }
        }
        return false;
    }

    containsInputInBox(input: number, pair: Pair, sudoku: Array<GridRow>): boolean {
        let firstRow = Math.floor((pair.row) / 3) * 3;
        //let lastRow = firstRow + 2;
        let firstCol = Math.floor(pair.col / 3) * 3;
        // let lastCol = lastRow + 2;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.getInput(new Pair(firstRow + i, firstCol + j), sudoku) === input) {
                    return true;
                }
            }
        }
        return false;
    }

    getInput(pair: Pair, sudoku: Array<GridRow>): number {
        return sudoku[pair.row].rowValue[pair.col].value;
    }

    testFunction(i: number): number {
        return i + 1;
    }

    showEmpty(sudoku: Array<GridRow>) {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.getInput(new Pair(i, j), sudoku) === 0 || this.getInput(new Pair(i, j), sudoku) === null) {
                    sudoku[i].rowValue[j].value = null;
                    sudoku[i].rowValue[j].isReadOnly = false;
                }
            }
        }
        return sudoku;
    }
}

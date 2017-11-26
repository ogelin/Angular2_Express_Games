const enum SPACES {
    ZEROS_NUMB_NORMAL = 35,
    ZEROS_NUMB_HARD = 50
}

const NORMAL_LEVEL = "Normal";
const HARD_LEVEL = "Difficile";
const REQUEST_TYPE = "GENERATION";

const DATE_TIME_OPTIONS = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
};

import { GridRow, RowValue } from '../classes/gridRow';
import { GridManager } from './grid-manager.service';
import { Remover } from './caseRemover';
import { Solver } from './sudokuSolver';
import { ReadWriteToFile } from '../classes/readWriteToFile';
import { NORMAL_SUDOKU_SOLUTIONS, NORMAL_EMPTY_SUDOKUS, PUZZLE } from '../data/sudoku-data';
import { DIFFICULT_SUDOKU_SOLUTIONS, DIFFICULT_EMPTY_SUDOKUS } from '../data/sudoku-data';

module GridManagerService {

    export class GridManager {
        private static instance: GridManagerService.GridManager;
        private remover: Remover;
        private solver: Solver;
        private sudoku: Array<GridRow>;
        private readWriteToFile: ReadWriteToFile;

        static getInstance(): GridManagerService.GridManager {
            if (GridManagerService.GridManager.instance === undefined) {
                GridManagerService.GridManager.instance = new GridManagerService.GridManager();
            }

            return GridManagerService.GridManager.instance;
        }

        constructor() {
            this.readWriteToFile = ReadWriteToFile.getInstance();
            this.remover = new Remover();
            this.solver = new Solver();
            this.reinitialiseSudoku();
        }

        saveSudoku() {
            //to do
        }

        getNdifficultGrid(): number {
            return DIFFICULT_EMPTY_SUDOKUS.length;
        }

        getNnormalGrid(): number {
            return NORMAL_EMPTY_SUDOKUS.length;
        }

        // pour tets TODO: DELETE AFTER TEST
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


        reinitialiseSudoku() {
            let index = 0;

            this.sudoku = new Array<GridRow>();

            for (let row = 0; row < 9; row++) {
                this.sudoku.push(new GridRow([]));
                for (let col = 0; col < 9; col++) {
                    this.sudoku[row].rowValue.push(new RowValue(PUZZLE[index]));
                    index++;
                }
            }
        }
        /* loads grids into the data class */
        loadSudokuData(solutionData: Array<GridRow>[], emptyData: Array<GridRow>[], zeros: number) {
            this.reinitialiseSudoku();
            let a = this.copySudoku(this.sudoku);
            a = this.randomizer(this.copySudoku(a));

            let b = this.copySudoku(a);

            solutionData.push(this.copySudoku(b));

            let aCopy = this.copySudoku(a); //keeps clean copy of "a" for later ** DO NOT MODIFY **
            a = this.removeZeroes(zeros, a);

            while (!this.solver.hasUniqueSolution(a)) {
                a = this.copySudoku(aCopy);
                a = this.removeZeroes(zeros, a);
            }

            this.addEvent(zeros);

            emptyData.push(a);
            this.solver.showEmpty(emptyData[emptyData.length - 1]);

        }

        addEvent(zeros: number){
           let dateTime = new Date().toLocaleString('en-us', DATE_TIME_OPTIONS);
            let event: string;
            event = dateTime + " : " + REQUEST_TYPE;
            event += (zeros === SPACES.ZEROS_NUMB_NORMAL) ? " : " + NORMAL_LEVEL : " : " + HARD_LEVEL;
            this.readWriteToFile.addEvent(event);
        }

        emptyData() {
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
        }

        /* do this when you load the page */
        initalizeSudokuData(quantity: number) {
            this.emptyData();
            for (let i = 0; i < quantity; i++) {
                // load NORMAL SUDOKU
                this.loadSudokuData(NORMAL_SUDOKU_SOLUTIONS, NORMAL_EMPTY_SUDOKUS, SPACES.ZEROS_NUMB_NORMAL);

                //load HARD SUDOKU
                this.loadSudokuData(DIFFICULT_SUDOKU_SOLUTIONS, DIFFICULT_EMPTY_SUDOKUS, SPACES.ZEROS_NUMB_HARD);
            }
        }

        /* mostly used for testing*/
        areSameSudoku(sudo1: Array<GridRow>, sudo2: Array<GridRow>): boolean {
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    if (sudo1[row].rowValue[col].value !== null && sudo2[row].rowValue[col].value !== null) {
                        if (sudo1[row].rowValue[col].value !== 0 && sudo2[row].rowValue[col].value !== 0) {
                            if (sudo1[row].rowValue[col].value !== sudo2[row].rowValue[col].value) {
                                return false;
                            }
                        }
                    }
                }
            }
            return true;
        }

        /*Converts a sudoku from number table format to our array format*/
        createGrid(puzzleCopy: number[], rowMax?: number, ): Array<GridRow> {
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
        /*returns a new copy of your sudoku (which helps to prevent referrencing mistakes)*/
        copySudoku(sudo: Array<GridRow>): Array<GridRow> {
            let newGridTemp = new Array<GridRow>();
            for (let i = 0; i < 9; i++) {
                newGridTemp.push(new GridRow([]));
                for (let j = 0; j < 9; j++) {
                    newGridTemp[i].rowValue.push(new RowValue(sudo[i].rowValue[j].value));
                }
            }
            return newGridTemp;
        }
        /* removes the number of zeros you ask for. does NOT make sure the grid is valid*/
        removeZeroes(nbZeroes: number, sudo: Array<GridRow>): Array<GridRow> {
            let grilleZeroes = new Array<GridRow>();
            grilleZeroes = this.copySudoku(sudo);

            while (this.solver.countZeros(grilleZeroes) !== nbZeroes) {
                grilleZeroes = this.remover.putZero(grilleZeroes);
            }
            return grilleZeroes;
        }

        getSudoku(level: string): Array<GridRow> {
            let grid;
            if (level.toLowerCase() === NORMAL_LEVEL.toLowerCase()) {
                grid = NORMAL_EMPTY_SUDOKUS.shift();
                this.loadSudokuData(NORMAL_SUDOKU_SOLUTIONS, NORMAL_EMPTY_SUDOKUS, SPACES.ZEROS_NUMB_NORMAL);
            }
            else {
                grid = DIFFICULT_EMPTY_SUDOKUS.shift();
                this.loadSudokuData(DIFFICULT_SUDOKU_SOLUTIONS, DIFFICULT_EMPTY_SUDOKUS, SPACES.ZEROS_NUMB_HARD);
            }
            return grid;
        }

        /** @@@@@@@@@@@@@@@@@ operations qui affectent le sudoku original @@@@@@@@@@@@@@@@@@@@ **/
        // Methode permettant de permuter  deux valeurs par rapport à une ligne
        swapRow(row1: number, row2: number, gridTmp: Array<GridRow>): Array<GridRow> {
            let tempGridRow = gridTmp[row1];
            gridTmp[row1] = gridTmp[row2];
            gridTmp[row2] = tempGridRow;
            return gridTmp;
        }
        // Methode permettant de permuter deux valeurs par rapport à colonne
        swapCol(col1: number, col2: number, grid: Array<GridRow>): Array<GridRow> {
            for (let i = 0; i < 9; i++) {
                let temp = grid[i].rowValue[col1];
                grid[i].rowValue[col1] = grid[i].rowValue[col2];
                grid[i].rowValue[col2] = temp;
            }
            return grid;
        }
        //
        randomRow(min: number, max: number, grid: Array<GridRow>): Array<GridRow> {
            let randomrow1 = this.randomNumber(min, max);
            let randomrow2 = this.randomNumber(min, max);
            while (randomrow1 === randomrow2) {
                randomrow2 = this.randomNumber(min, max);
            }
            this.swapRow(randomrow1, randomrow2, grid);
            return grid;
        }

        //
        randomCol(min: number, max: number, grid: Array<GridRow>): Array<GridRow> {
            let randomcol1 = this.randomNumber(min, max);
            let randomcol2 = this.randomNumber(min, max);
            while (randomcol1 === randomcol2) {
                randomcol2 = this.randomNumber(min, max);
            }
            this.swapCol(randomcol1, randomcol2, grid);
            return grid;
        }

        //
        invertRow(grid: Array<GridRow>): Array<GridRow> {

            for (let i = 0; i < 4; i++) {
                let temp = grid[i];
                grid[i] = grid[8 - i];
                grid[8 - i] = temp;
            }
            return grid;
        }

        //
        invertCol(grid: Array<GridRow>): Array<GridRow> {
            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 4; j++) {
                    let temp = grid[i].rowValue[j];
                    grid[i].rowValue[j] = grid[i].rowValue[8 - j];
                    grid[i].rowValue[8 - j] = temp;
                }
            }
            return grid;
        }

        //
        invertDiag(grid: Array<GridRow>): Array<GridRow> {
            for (let i = 1; i < grid.length; i++) {
                for (let j = 0; j < i; j++) {
                    let temp = grid[j].rowValue[i];
                    grid[j].rowValue[i] = grid[i].rowValue[j];
                    grid[i].rowValue[j] = temp;
                }
            }
            return grid;
        }

        randomNumber(min: number, max: number): number {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        randomizer(grid: Array<GridRow>): Array<GridRow> {
            for (let i = 0; i < 1000; i++) {
                let cas = this.randomNumber(1, 8);
                switch (cas) {
                    case 1:
                        this.randomRow(0, 2, grid);
                        break;

                    case 2:
                        this.randomRow(3, 5, grid);
                        break;

                    case 3:
                        this.randomRow(6, 8, grid);
                        break;

                    case 4:
                        this.randomCol(0, 2, grid);
                        break;

                    case 5:
                        this.randomCol(3, 5, grid);
                        break;

                    case 6:
                        this.randomCol(6, 8, grid);
                        break;

                    case 7:
                        this.invertRow(grid);
                        break;

                    case 8:
                        this.invertDiag(grid);
                        break;

                    case 9:
                        this.invertCol(grid);
                        break;
                }
            }
            return grid;
        }

    }

}

export = GridManagerService;

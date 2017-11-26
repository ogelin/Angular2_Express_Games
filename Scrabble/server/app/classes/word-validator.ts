import { GameRoomManager } from './gameRoomManager';
import {ORIENTATIONS, BOARD} from './commands';
import {Easel} from './easel';

export class WordValidator {
    gameRoomManager: GameRoomManager;

    constructor(gameRoomManager?: GameRoomManager){
        if (gameRoomManager !== undefined){
           this.gameRoomManager = gameRoomManager;
        }
    }
    /*checks word is allowed*/
    canPlayWord(word: string, orientation: string, row: number, col: number, username: string): Boolean {
        let grid = this.gameRoomManager.findRoomByPlayerUsername(username).grid;
        let easel = this.gameRoomManager.findPlayerByUsername(username).easel;

        return (this.wordLengthFits(word, orientation, row, col) &&
            !this.isCollision(word, orientation, row, col, grid.content) &&
            this.isAdjacent(word, orientation, row, col, grid.content)
            && grid.validWord(word)
            && this.playableWord(row, col, orientation, word, easel, grid.content)
            );
    }
     /*checks the word doesn't exceed the board length*/
    wordLengthFits(word: string, orientation: string, row: number, col: number): Boolean {
        let wordLength = word.length;
        if (wordLength > BOARD.length) {
            return false;
        }
        if (this.isVertical(orientation)) {
            if (row + wordLength > BOARD.length) {
                return false;
            }
        }
        if (this.isHorizontal(orientation)) {
            if (col + wordLength > BOARD.length) {
                return false;
            }
        }
        return true;
    }

     isVertical(dir: string) {
        return (dir.toLowerCase().trim() === ORIENTATIONS['vertical']);
    }
    isHorizontal(dir: string) {
        return (dir.toLowerCase().trim() === ORIENTATIONS['horizontal']);
    }
    isAdjacent(word: string, orientation: string, row: number, col: number, puzzle: Array<Array<string>>): boolean {
        if (this.gridIsEmpty(puzzle)) {
            return true;
        }
        for (let i = 0; i < word.length; i++) {
            if ( puzzle[row + 1][col] !== "") {
                return true;
            }
            if (puzzle[row - 1][col] !== "") {
                return true;
            }
            if ( puzzle[row][col + 1] !== "") {
                return true;
            }
            if ( puzzle[row][col - 1] !== "") {
                return true;
            }
            if (this.isHorizontal(orientation) && col < BOARD['lengthGrid']) {
                col++;
            }
            else if (this.isVertical(orientation) && row < BOARD['lengthGrid']) {
                row++;
            }
        }
        return false;
    }

    gridIsEmpty(grid: Array<Array<string>>): boolean {
        for (let i = 0; i < BOARD['lengthGrid']; i++) {
            for (let j = 0; j < BOARD['lengthGrid']; j++) {
                if (grid[i][j] !== undefined && grid[i][j] !== '') {
                    return false;
                }
            }
        }
        return true;
    }

    //checks if letters of word played are on the easel or on the board
    playableWord(posI: number, posJ: number, orientation: string,
        word: string, easel: Easel, grid: Array<Array<string>>): boolean {
        let playableWord = true;

        let missingLetters = 0;
        let letterFound = Array<string>();
        letterFound = [];
        let tempLetters = new Array<string>();
        tempLetters = [];

        for (let i = 0; i < easel.tiles.length; i++) {
            //tempEasel.addTile(new Letter(easel.tiles[i].letter));
            tempLetters.push(easel.tiles[i].letter);
        }

        let tempEasel = new Easel(tempLetters);

        for (let i = 0; i < tempEasel.tiles.length; i++) {
            for (let j = 0; j < word.length; j++) {
                if (word.charAt(j) === tempEasel.tiles[i].letter) { //pose probleme
                    letterFound.push(tempEasel.tiles[i].letter);
                    tempEasel.tiles.splice(i, 1);
                }
            }
        }
        missingLetters = word.length - letterFound.length;

        if (missingLetters > 0) {
            if (orientation === "v") {
                for (let row = posI; row < posI + word.length; row++) {
                    for (let i = 0; i < word.length; i++) {
                        if (word.charAt(i) === grid[row][posJ]) {
                            missingLetters--;
                        }
                    }
                }
            }
            if (orientation === "h") {
                for (let col = posJ; col < posJ + word.length; col++) {
                    for (let i = 0; i < word.length; i++) {
                        if (word.charAt(i) === grid[posI][col]) {
                            missingLetters--;
                        }
                    }
                }
            }
        }
        if (missingLetters > this.starsOnEasel(easel)) {
            playableWord = false;
        }
        return playableWord;
    }
    starsOnEasel(easel: Easel): number {
        let starCount = 0;
        for (let i = 0; i < easel.tiles.length; i++) {
            if (easel.tiles[i].letter === "*") {

                starCount++;
            }
        }
        return starCount;
    }

    /*checks the word does not overwrite other word */
    isCollision(word: string, orientation: string, row: number, col: number, puzzle: Array<Array<string>>) {
        if (this.gridIsEmpty(puzzle)){
            return false;
        }
        for (let i = 0; i < word.length; i++) {
            if (puzzle[row][col] !== "" && puzzle[row][col] !== word.charAt(i)) {
                return true;
            }
            if (this.isHorizontal(orientation)) {
                col++;
            }
            else if (this.isVertical(orientation)) {
                row++;
            }
        }
        return false;
    }
}

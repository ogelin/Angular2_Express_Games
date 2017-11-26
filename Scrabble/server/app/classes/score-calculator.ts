import { GridBonus } from "./gridBonus";
import { Grid } from "./grid";

export interface NewLetter {
    letter: string;
    i: number;
    j: number;
}
export class ScoreCalculator {
    gridG: Grid;
    gridB: GridBonus;
    constructor() {
        this.gridG = new Grid();
        this.gridB = new GridBonus();
    }

    calculateScore(word: String): number {
        word = word.toUpperCase();
        let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ*";
        let values: number[] = [1, 3, 3, 2, 1, 4, 2, 4, 1, 8, 10, 1, 2, 1, 1, 3, 8, 1, 1, 1, 1, 4, 10, 10, 10, 10, 0];

        let sum = 0;

        for (let i = 0; i < word.length; i++) {
            sum = sum + values[alphabet.indexOf(word.charAt(i))];
        }
        return sum;
    }

    returnBonusType(positioni: number, positionj: number, direction: string, word: string): Array<string> {
        let boni: Array<string> = new Array<string>();
        if (direction === "h") {
            for (let j = positionj; j < positionj + word.length; j++) {
                boni.push(this.gridB.gridBonus[positioni][j]);
            }
        }
        else if (direction === "v") {
            for (let i = positioni; i < positioni + word.length; i++) {
                boni.push(this.gridB.gridBonus[i][positionj]);
            }
        }
        return boni;
    }

    scoreWithBonus(posI: number, posJ: number, direction: string, word: string): number {
        let sum = 0;
        let multiplier = 1;
        word = word.toUpperCase();
        let bonus = this.returnBonusType(posI, posJ, direction, word);
        for (let i = 0; i < bonus.length; i++) {
            switch (bonus[i]) {
                case 'DL':
                    sum += this.calculateScore(word.charAt(i)) * 2;
                    break;
                case 'TL':
                    sum += this.calculateScore(word.charAt(i)) * 3;
                    break;
                case 'DW':
                    multiplier *= 2;
                    break;
                case 'TW':
                    multiplier *= 3;
                    break;
                default:
                    sum += this.calculateScore(word.charAt(i));
            }
        }
        return sum *= multiplier;
    }

    findUppermostLetter(posI: number, posJ: number, grid: Array<Array<string>>): number {
        let i = posI - 1;
        while (grid[i][posJ] !== "") {
            i--;
        }
        return i + 1;
    }

    findLowermostLetter(posI: number, posJ: number, grid: Array<Array<string>>): number {
        let i = posI + 1;
        while (grid[i][posJ] !== "") {
            i++;
        }
        return i - 1;
    }

    findLeftmostLetter(posI: number, posJ: number, grid: Array<Array<string>>): number {
        let j = posJ - 1;
        while (grid[posI][j] !== "") {
            j--;
        }
        return j + 1;
    }

    findRightmostLetter(posI: number, posJ: number, grid: Array<Array<string>>): number {
        let j = posJ + 1;
        while (grid[posI][j] !== "") {
            j++;
        }
        return j - 1;
    }

    extractNewLetters(posI: number, posJ: number,
        orientation: string, word: string, grid: Array<Array<string>>): Array<NewLetter> {
        let newLetter: NewLetter;
        let newLetters: Array<NewLetter>;
        newLetters = [];

        if (orientation === "h") {
            for (let j = posJ; j < posJ + word.length; j++) {
                if (grid[posI][j] === "") {
                    newLetter = {
                        letter: word.charAt(j - posJ),
                        i: posI,
                        j: j
                    };
                    newLetters.push(newLetter);
                }
            }
        }
        if (orientation === "v") {
            for (let i = posI; i < posI + word.length; i++) {
                if (grid[i][posJ] === "") {
                    newLetter = {
                        letter: word.charAt(i - posI),
                        i: i,
                        j: posJ
                    };
                    newLetters.push(newLetter);
                }
            }
        }
        return newLetters;
    }

    returnWordsCreated(posI: number, posJ: number, orientation: string,
        word: string, grid: Array<Array<string>>): Array<string> {
        let wordsCreated = Array<string>();
        wordsCreated = [];
        wordsCreated.push(word);
        let newWord = "";

        if (this.gridG.gridIsEmpty(grid)) {
            return wordsCreated;
        }
        let newLetters = this.extractNewLetters(posI, posJ, orientation, word, grid);

        // Placer le nouveau mot sur la grille
        let x = 0, y = 0;
        if (orientation === "h") {
            for (y = posJ; y < posJ + word.length; y++) {
                grid[posI][y] = word.charAt(x++);
            }
        }
        if (orientation === "v") {
            for (x = posI; x < posI + word.length; x++) {
                grid[x][posJ] = word.charAt(y++);
            }
        }
        for (let k = 0; k < newLetters.length; k++) {
            let upperMostIndex = this.findUppermostLetter(newLetters[k].i, newLetters[k].j, grid);
            let lowerMostIndex = this.findLowermostLetter(newLetters[k].i, newLetters[k].j, grid);
            for (let i = upperMostIndex; i <= lowerMostIndex; i++) {
                newWord += grid[i][newLetters[k].j];
            }
            if (newWord.length > 1 && wordsCreated.indexOf(newWord) <= -1) {
                wordsCreated.push(newWord);
            }
            newWord = "";
        }

        for (let l = 0; l < newLetters.length; l++) {
            let leftMostIndex = this.findLeftmostLetter(newLetters[l].i, newLetters[l].j, grid);
            let rightMostIndex = this.findRightmostLetter(newLetters[l].i, newLetters[l].j, grid);
            for (let j = leftMostIndex; j <= rightMostIndex; j++) {
                newWord += grid[newLetters[l].i][j];
            }
            if (newWord.length > 1 && wordsCreated.indexOf(newWord) <= -1) {
                wordsCreated.push(newWord);
            }
            newWord = "";
        }
        return wordsCreated;
    }

    totalPoints(posI: number, posJ: number, orientation: string, word: string, grid: Array<Array<string>>): number {
        let words = this.returnWordsCreated(posI, posJ, orientation, word, grid);
        let totSum = 0;
        totSum = this.scoreWithBonus(posI, posJ, orientation, word);
        console.log(totSum);

        for (let i = 0; i < words.length; i++) {
            totSum += this.calculateScore(words[i]);
        }
        console.log(totSum);
        totSum -= this.calculateScore(word);
        return totSum;
    }
}

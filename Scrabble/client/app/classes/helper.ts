
import { Row } from './row';
import { Letter } from './letter';
import { puzzle } from '../classes/mock-scrabble';


let BOARD = {
    'maxLetter': 'o',
    'minLetter': 'a',
    'length': 16,
    'minIndex': 0
};

export let MESSAGES = {
    '!aide':
    `
Voici les commandes disponibles:
Pour placer un mot faire la commande: 
!placer ligne|colonne (h|v) mot 
La ligne et la colonne permettent de positionnner la 1ere lettre du mot.
Le h et le v signifient si le mot est à l'horizontale ou à la verticale");
Pour changer les lettres sur le chevalet faire la commande :
!changer lettre
Les lettres doivent être écrites en minuscule.
* est pour la case blanche
Pour passer son tour faire la commande :
!passer
`,

};

export class Helper {

    /* converts id number to corresponding string index, ex: 61 -> C13 */
    convertIndexValueToString(indexID: number): string {

        let num = indexID % 16;
        let alpha = indexID / 16;
        let letter = String.fromCharCode(96 + alpha);

        let code = "";
        code = letter + num.toString();
        return code;

    }
    /* converts letter-number pair to id number, ex: C13 -> 61 */
    convertIndexValueToNumber(row: string, col: number): number {
        let rowCode = row.toLowerCase().charCodeAt(BOARD.minIndex);
        let minCode = BOARD.minLetter.charCodeAt(BOARD.minIndex);
        let colNum = col;

        let rowNum = rowCode - minCode + 1;
        let res = BOARD.length * rowNum + colNum;
        return res;
    }

    /*conversion entre format de scrabble de arrays du serveur VERS le celui de row du client
    /* EX: Array<Array<String>> ===conversion ==> Array<Row>  */
    convertScrabbleFormat(scrabble: Array<Array<string>>): Array<Row> {
        let tmp = new Array<Row>();

        for (let i = 0; i < scrabble.length; i++) {
            let row = new Row(new Array<Letter>());
            for (let j = 0; j < scrabble[i].length; j++) {
                row.letters.push(new Letter(scrabble[i][j]));
            }
            tmp.push(row);
        }

        let row = new Row(new Array<Letter>());
        let topRow = [null, "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"];
        let firstCol = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O"];

        for (let i = 0; i < topRow.length; i++) {
            row.letters.push(new Letter(topRow[i]));
        }
        tmp.unshift(row); //add first row to beginning of row array

        for (let i = 1; i < tmp.length; i++) {
            tmp[i].letters.unshift(new Letter(firstCol[i - 1])); //adding letters at first index of rows
        }
        return tmp;
    }

    /* copies a puzzle to the mock-puzzle that displays in the html*/
    copyToPuzzle(init: Array<Row>): void {
        let count = 0;

        for (let i = 0; i < init.length; i++) {
            for (let j = 0; j < init[i].letters.length; j++) {
                puzzle[i].letters[j].letter = init[i].letters[j].letter;
                puzzle[i].letters[j].value = init[i].letters[j].value;

                if (init[i].letters[j].letter !== undefined && j !== 0 && i !== 0) {
                    let inputElement = <HTMLInputElement>document.getElementById("input" + '' + count);
                    if (inputElement !== null && inputElement !== undefined) {
                        inputElement.removeAttribute("id");
                        inputElement.className += " gridTile";
                    }

                }
                count++;
            }
        }
        this.putBonusStarsBack();
    }

    /*fixes up the grid's css id's so the html displays a star OR a tile OR a blank space in each square*/
    putBonusStarsBack() {
        let count = 0;
        let list = document.getElementsByClassName("cell");
        for (let i = 0; i < puzzle.length; i++) {
            for (let j = 0; j < puzzle[i].letters.length; j++) {
                if (puzzle[i].letters[j].letter === undefined || puzzle[i].letters[j].letter === "") {
                    let inputElement = <HTMLInputElement>list[count];
                    if (inputElement !== null && inputElement !== undefined) {
                        inputElement.id = "input" + count;
                        if (inputElement.classList.contains("gridTile")) {
                            inputElement.classList.remove("gridTile");
                        }
                    }
                }
                count++;
            }

        }
    }
}



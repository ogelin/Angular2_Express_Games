import { Letter } from "./letter";
export const enum EVENTS {
    LEFT_ARROW = 37,
    UP_ARROW = 38,
    ASTERISK = 56,
    RIGHT_ARROW = 39,
    DOWN_ARROW = 40,
    ESC = 27,
    DELETE = 46,
    LETTER_A = 65,
    LETTER_Z = 90,
    TAB = 9,
}

export class Easel {
    tiles: Array<Letter>;

    constructor(tiles?: string[]) {
        this.tiles = new Array<Letter>();
        if (tiles !== undefined) {
            for (let i = 0; i < tiles.length; i++) {
                this.addTile(new Letter(tiles[i]));
            }
        }
    }

    addTile(letter: Letter): void {
        this.tiles.push(letter);
    }

    swapTiles(tile: number, swapTile: number) {
        let tmp = this.tiles[swapTile];
        this.tiles[swapTile] = this.tiles[tile];
        this.tiles[tile] = tmp;
    }
    /* returns the index of the first focused letter in the easel or -1 if there's none*/
    getFocusIndex(): number{
        let easel = document.querySelectorAll('div.letters input');

         for (let i = 0; i < easel.length; i++){
             if (easel[i].classList.contains("focused")){
                 return i;
             }
         }
         return -1;
    }
     /*adds focus to letter on easel corresponding to keyboard input*/
    letterChange(event: KeyboardEvent){
        let focusedIndex = this.getFocusIndex();
        let offset = this.getFocusIndex();
        let keyCode = event.keyCode;
        if (keyCode === EVENTS.ASTERISK){
            keyCode = "*".charCodeAt(0);
        }

        if (offset === -1){
            offset = 0; //if there's no focused element we'll start at 0
        }
        let focusedElement = <HTMLInputElement>document.getElementById("letter" + '' + offset);

        for (let i = 0; i < this.tiles.length; i++){
            //we need to start iteration at first focused element (or 0 if none) & loop through to beginning
            let pos = (i + offset) % this.tiles.length;
            let letter = this.tiles[pos].letter;
            let inputElement = <HTMLInputElement>document.getElementById("letter" + '' + pos);
            inputElement.classList.remove('focused');

            if (letter.toUpperCase().charCodeAt(0) === keyCode && focusedIndex !== pos){ //skip the focused letter
                    if (focusedElement !== null){
                        focusedElement.classList.remove('focused');
                    }
                    inputElement.className += " focused";
                    break;
                }
             }
    }
    /*exchanges letters on the easel in positions corresponding to keyboard input*/
    arrowMove(event: KeyboardEvent){
        let current = this.getFocusIndex();
        let currentElement = <HTMLInputElement>document.getElementById("letter" + '' + current);
        currentElement.classList.remove('focused');

        if (event.keyCode === EVENTS.LEFT_ARROW) {
            let index = current - 1;
            if (index < 0) { //we reached the end of the easel
                index = this.tiles.length - 1;
            }
            this.swapTiles(current, index);
            document.getElementById("letter" + current).className += " focused";
        }
        else if (event.keyCode === EVENTS.RIGHT_ARROW) {
            let index = current + 1;
            if (index > this.tiles.length - 1) { //we reached the end of the easel
                index = 0;
            }
            this.swapTiles(current, index);
            document.getElementById("letter" + current).className += " focused";

        }
    }

}

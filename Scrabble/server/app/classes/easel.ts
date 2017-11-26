import { Letter } from "./letter";
import { Bag } from "./bag";

export const EASEL_DEFAULT_LENGTH = 7;

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

    placeRandomTiles(quantity: number, bag: Bag): void {
        for (let i = 0; i < quantity && i < bag.size(); i++) {
            let letter = bag.takeRandomTile();
            this.tiles.push(letter);
        }
    }
    addTile(letter: Letter): void {
        this.tiles.push(letter);
    }

    replaceTile(oldLetter: Letter, newLetter: Letter){
        for (let i = 0; i < this.tiles.length; i++){
            if (this.tiles[i].letter === oldLetter.letter){
                this.tiles[i] = newLetter;
                return; //stop in case there's more than one copy of the letter
            }
        }
    }

    removeTile(letter: Letter): void {
        for (let i = 0; i < this.tiles.length; i++){
            if (this.tiles[i].letter === letter.letter){
                this.tiles.splice(i, 1);
                return; //stop in case there's more than one copy of the letter
            }
        }
    }

    removeWord(word: string){
        for (let i = 0; i < word.length; i++){
            this.removeTile(new Letter(word.charAt(i)));
        }
    }

    /*returns TRUE when the easel contains AT LEAST one occurrence of given letter
    or FALSE if no occurrences found*/
    contains(tile: Letter): boolean{
        for (let i = 0; i < this.tiles.length; i++){
            if (tile.letter === this.tiles[i].letter){
                return true;
            }
        }
        return false;
    }
    /*finds how many times the given letter is found in the easel */
    containsHowMany(letter: Letter): number{
      let count = 0;
      for (let i = 0; i < this.tiles.length; i++){
            if (letter.letter === this.tiles[i].letter){
                count ++;
            }
        }
        return count;
    }

    swapTiles(tile: number, swapTile: number) {
        let tmp = this.tiles[swapTile];
        this.tiles[swapTile] = this.tiles[tile];
        this.tiles[tile] = tmp;
    }

}

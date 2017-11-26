let quantities = {
    'a': 9,
    'b': 2,
    'c': 2,
    'd': 3,
    'e': 15,
    'f': 2,
    'g': 2,
    'h': 2,
    'i': 8,
    'j': 1,
    'k': 1,
    'l': 5,
    'm': 3,
    'n': 6,
    'o': 6,
    'p': 2,
    'q': 1,
    'r': 6,
    's': 6,
    't': 6,
    'u': 6,
    'v': 2,
    'w': 1,
    'x': 1,
    'y': 1,
    'z': 1,
    '*': 2
};

import { Letter } from "./letter";
export class Bag {

    content: Array<Letter>;

    constructor(content?: Array<Letter>) {
        this.content = new Array<Letter>();
        if (content !== undefined){
            this.content = content;
        }
        else {
            this.initializeContent();
        }

    }

    isEmpty(): Boolean {
        if (this.content.length === 0) {
            return true;
        }
        return false;
    }

    initializeContent() {
        for (let key in quantities) {
            if (quantities.hasOwnProperty(key)) {
                let quantity = quantities[key];
                this.addTile(new Letter(key), quantity);
            }
        }
    }

    takeRandomTile(): Letter {
        if (this.isEmpty()) { //we can't return any letter if the bag if empty
            return null;
        }

        let randomIndex = Math.floor(Math.random() * this.content.length);
        let letter = this.content[randomIndex];
        this.removeTile(letter);
        return letter;
    }


    removeTile(tile: Letter) {
        for (let i = 0; i < this.content.length; i++) {
            if (tile.equals(this.content[i]) && this.content[i].value >= 0) {
                let index = i;
                this.content.splice(index, 1); //we found the first tile with the desired letter so we can remove it
                break;
            }
        }
    }

    addTile(tile: Letter, quantity?: number) {

        if (quantity === undefined) {
            quantity = 1;
        }
        for (let i = 0; i < quantity; i++) {
            this.content.push(tile);
        }
    }
    size(): number {
        return this.content.length;
    }

    addTiles(letters: string){
         for (let l = 0 ; l < letters.length; l++){
            let letter = new Letter(letters.charAt(l));
            this.addTile(letter);
         }
    }

    emptyContent(){
        this.content = new Array<Letter>();
    }

}

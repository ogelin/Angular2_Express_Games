import { expect } from 'chai';
import { WordValidator } from '../classes/word-validator';
import {Letter} from '../classes/letter';
import {Grid} from '../classes/grid';

import {Easel} from '../classes/easel';

describe('Test de la classe word valiator', function () {

    let validator: WordValidator;
    let word: Array<Letter>;
    let grid: Grid;
    let easel: Easel;

    beforeEach(() => {
        validator = new WordValidator();
        word = new Array<Letter>();
        grid = new Grid();
    });


    it('shouldn t let you play words that exceed 15 characters', function(){
        let wrd = "abcdefghijklmnopqrstuvwxyz";

        expect(validator.wordLengthFits(wrd, 'h', 1, 1)).to.be.false;
    });

    it('should let you play a word that fits', function(){
        let wrd = "hello";
        expect(validator.wordLengthFits(wrd, 'v', 1, 1)).to.be.true;
    });

    it('should not let you play a word that does not fit', function(){
        let wrd = "hello";
        expect(validator.wordLengthFits(wrd, 'v', 15, 15)).to.be.false;
    });
    it('should not let you overwrite a word that s already there', function(){
        let wrd = "hello";

        let row = 1;
        let col = 1;
        for (let i = 0; i < wrd.length; i++){
                grid.content[row][col] = wrd[i];
                col++;
            }
        expect(validator.isCollision(wrd, 'h', 1, 1, grid.content)).to.be.false;
    });
    it('should say grid is Empty', function () {
        expect(validator.gridIsEmpty(grid.content)).to.be.true;
    });

    it('should say grid is not Empty', function () {
        grid.addWord(1, 1, "v", "allo");
        expect(validator.gridIsEmpty(grid.content)).to.be.false;
    });

    it ('should find it s an adjacent word', function() {
        grid.addWord(3, 4, "v", "allo");
        expect(validator.isAdjacent("allo", "h", 3, 4, grid.content)).to.be.true;
    });

    it ('should find word is playable', function() {
        grid.content = [
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "a", "l", "l", "o", "", "", "", ""],
        ["", "", "", "", "", "", "", "l", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "l", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "e", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "r", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    ];
        easel = new Easel;
        let letters = ["e", "v", "a", "*", "i", "p", "h"];

        for (let i = 0; i < letters.length; i++) {
            easel.addTile(new Letter (letters[i]));
        }
        expect(validator.playableWord(11, 7, "h", "reve", easel, grid.content)).to.be.true;
    });

    it ('should find number of stars on easel is 1', function() {
        easel = new Easel();
        let letters = ["a", "e", "v", "*", "i", "p", "h"];

        for (let i = 0; i < letters.length; i++) {
            easel.addTile(new Letter (letters[i]));
        }
        expect(validator.starsOnEasel(easel)).to.equal(1);
    });
});



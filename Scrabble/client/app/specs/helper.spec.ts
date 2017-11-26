import { expect } from 'chai';
import { Helper } from '../classes/helper';
import { Letter } from '../classes/letter';
import { puzzle } from '../classes/mock-scrabble';

describe('Test de la classe easel', function () {

    let helper: Helper;
    let word: Array<Letter>;

    beforeEach(() => {
        helper = new Helper();
        word = new Array<Letter>();
    });

    it('should return b6', function () {
        expect(helper.convertIndexValueToString(38)).to.equal("b6");
    });

    it('convertIndexValueToNumber should return 38', function () {
        expect(helper.convertIndexValueToNumber("b", 6)).to.be.equal(38);
    });

    it('should convert between scrabble types (from server to client)', function () {

        let gridGame = [
            ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""/**/, "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
        ];


        let scr = helper.convertScrabbleFormat(gridGame);

        for (let i = 0; i < puzzle.length; i++){
            for (let j = 0; j < puzzle[i].letters.length; j++){
            expect(scr[i].letters[j].letter).to.be.equal(puzzle[i].letters[j].letter);
            }
        }
    });

});


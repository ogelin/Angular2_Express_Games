import { expect } from 'chai';
import { Letter } from '../classes/letter';

describe('Test de la class letter', function () {

    it('assign score to a', function () {
        let letter = new Letter("a");
        expect(letter.value).to.equal(1);
    });

    it('assign score to c', function () {
        let letter = new Letter("c");
        expect(letter.value).to.equal(3);
    });

    it('assign score to *', function () {
        let letter = new Letter("*");
        expect(letter.value).to.equal(0);
    });

    it('should find letters are equal', function () {
        let letter = new Letter("d");
        let otherLetter = new Letter("d");
        expect(letter.equals(otherLetter)).to.be.true;
    });

    it('should find letters are not equal', function () {
        let letter = new Letter("d");
        let otherLetter = new Letter("*");
        expect(letter.equals(otherLetter)).to.be.false;
    });


});

import { expect } from 'chai';
import { Bag } from '../classes/bag';
import { Letter } from '../classes/letter';
import { Easel } from '../classes/easel';

describe('Test de la classe easel', function () {

    let easel: Easel;
    let bag: Bag;

    beforeEach(() => {
        easel = new Easel();
        bag = new Bag(new Array<Letter>());
    });

    it('Should add 7 letters', function () {
        bag.initializeContent();
        easel.placeRandomTiles(7, bag);
        expect(easel.tiles.length).to.equal(7);
    });

    it('Should remove 7 letters from the bag', function () {
        bag.initializeContent();
        let initialBagSize = bag.size();
        easel.placeRandomTiles(7, bag);
        expect(bag.size()).to.equal(initialBagSize - 7);
    });

    it('Should swap two tiles', function () {
        bag.initializeContent();
        easel.placeRandomTiles(7, bag);
        let firstLetter = easel.tiles[0];
        let secondLetter = easel.tiles[1];
        easel.swapTiles(0, 1);
        expect(easel.tiles[0]).to.equal(secondLetter);
        expect(easel.tiles[1]).to.equal(firstLetter);
    });
    it('Should should remove a letter', function () {
        easel = new Easel(["a", "b", "c", "d", "e"]);
        easel.removeTile(new Letter("a"));
        expect(easel.tiles.length).to.equal(4);
        expect(easel.tiles[0].letter).to.be.equal("b");
    });
    it('Should should remove a letter', function () {
        easel = new Easel(["a", "b", "c", "d", "e"]);
        easel.removeTile(new Letter("c"));
        expect(easel.tiles.length).to.equal(4);
        expect(easel.tiles[2].letter).to.be.equal("d");
    });
    it('Should should find each letter', function () {
        easel = new Easel(["a", "b", "c", "d", "e"]);
        easel.removeTile(new Letter("c"));
        expect(easel.contains(new Letter("a"))).to.be.true;
        expect(easel.contains(new Letter("b"))).to.be.true;
        expect(easel.contains(new Letter("d"))).to.be.true;
        expect(easel.contains(new Letter("e"))).to.be.true;
    });
    it('Should should NOT find letter thats not in the easel', function () {
        easel = new Easel(["a", "b", "c", "d", "e"]);
        easel.removeTile(new Letter("c"));
        expect(easel.contains(new Letter("z"))).to.be.false;
        expect(easel.contains(new Letter("k"))).to.be.false;
        expect(easel.contains(new Letter("2"))).to.be.false;
        expect(easel.contains(new Letter("l"))).to.be.false;
    });
    it('Should count occurrences', function () {
        easel = new Easel(["a", "b", "c", "d", "c"]);
        expect(easel.containsHowMany(new Letter("a"))).to.be.equal(1);
        expect(easel.containsHowMany(new Letter("c"))).to.be.equal(2);
    });

    it('Should remove letters', function () {
        easel = new Easel(["a", "b", "c", "d", "c"]);
        easel.removeWord("bcc");
        expect(easel.tiles.length).to.equal(2);
        expect(easel.tiles[1].letter).to.equal("d");
    });
    it('Should should not count occurrences when not found', function () {
        easel = new Easel(["a", "b", "c", "d", "c"]);
        easel.removeTile(new Letter("c"));
        expect(easel.containsHowMany(new Letter("z"))).to.be.equal(0);
        expect(easel.containsHowMany(new Letter("1"))).to.be.equal(0);
    });
    it('Should replace tile', function () {
        easel = new Easel(["a", "b", "c", "d", "c"]);
        easel.replaceTile(new Letter("a"), new Letter("b"));
        expect(easel.containsHowMany(new Letter("b"))).to.be.equal(2);
        expect(easel.tiles[0].letter).to.be.equal("b");
    });

});

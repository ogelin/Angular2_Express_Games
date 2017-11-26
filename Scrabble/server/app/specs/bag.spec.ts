import { expect } from 'chai';
import { Bag } from '../classes/bag';
import { Letter } from '../classes/letter';

describe('Test de la classe bag', function () {

    let bag: Bag;

    beforeEach(() => {
        bag = new Bag(new Array<Letter>());
    });

    it('Should add a tile', function () {
        bag.addTile(new Letter("a"));
        expect(bag.content.length).to.equal(1);
    });

    it('Should add 3 tiles', function () {
        bag.addTile(new Letter("a"), 3);
        expect(bag.content.length).to.equal(3);
    });
    it('Should add 3 tiles', function () {
        bag.addTile(new Letter("a"), 3);
        expect(bag.content.length).to.equal(3);
    });

    it('Should initialize contents of the bag', function () {
        bag.initializeContent();
        expect(bag.content.length).to.equal(102);
    });

    it('Should initialize the bag with 15x e', function () {
        bag.initializeContent();
        let count = 0;
        for (let i = 0; i < bag.content.length; i++) {
            if (bag.content[i].equals(new Letter("e"))) {
                count++;
            }
        }
        expect(count).to.be.equal(15);
    });

    it('Should say the bag size is 10', function () {
        bag.addTile(new Letter("a"), 3);
        bag.addTile(new Letter("c"), 7);
        expect(bag.size()).to.equal(10);
    });

    it('Should empty the bag', function () {
        bag.emptyContent();
        expect(bag.size()).to.equal(0);
    });

    it('Should add multiple tiles to the bag', function () {
        bag.emptyContent();
        bag.addTiles("hello");
        expect(bag.size()).to.equal(5);
        bag.addTiles("abc");
        expect(bag.size()).to.equal(8);
    });
});




import { expect } from 'chai';
import { Letter } from '../classes/letter';
import { Easel } from '../classes/easel';

describe('Test de la classe easel', function () {

    let easel: Easel;

    beforeEach(() => {
        easel = new Easel();
    });

    it('Should add a tile', function(){
        easel.addTile(new Letter("a"));
        expect(easel.tiles.length).to.equal(1);
    });


    it('Should swap two tiles', function () {
        easel.addTile(new Letter("a"));
        easel.addTile(new Letter("b"));
        let firstLetter = easel.tiles[0];
        let secondLetter = easel.tiles[1];
        easel.swapTiles(0, 1);
        expect(easel.tiles[0]).to.equal(secondLetter);
        expect(easel.tiles[1]).to.equal(firstLetter);
    });
});


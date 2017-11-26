import { expect } from 'chai';
import { Player } from '../classes/player';
import { Letter } from '../classes/letter';

describe('Test de la classe player', function () {

    it ('Should give the player an easel', function(){
        let player = new Player("" , "");
        player.initializeEasel([new Letter("a"), new Letter("b"), new Letter("c")]);
        expect(player.easel.tiles.length).to.equal(3);
        expect(player.easel.tiles[0].letter).to.equal("a");
    });


});



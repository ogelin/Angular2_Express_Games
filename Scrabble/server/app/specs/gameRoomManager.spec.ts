import { expect } from 'chai';
import { GameRoomManager } from '../classes/GameRoomManager';
import { Player } from '../classes/player';

describe('Test de la classe GameRoomManager', function () {

    let gameRoomManager: GameRoomManager;

    beforeEach(() => {
        gameRoomManager = new GameRoomManager();
    });

    it('Should add a player', function () {
        gameRoomManager.addPlayer(new Player("test0"), 2);
        gameRoomManager.addPlayer(new Player("test1"), 2);
        expect(gameRoomManager.gameRooms.length).to.equal(2);
    });

    it('Should add a player', function () {
        gameRoomManager.addPlayer(new Player("test0"), 2);
        gameRoomManager.addPlayer(new Player("test1"), 2);
        gameRoomManager.addPlayer(new Player("test2"), 2);
        expect(gameRoomManager.gameRooms.length).to.equal(3);
    });


    it('Should find player by username', function () {
        gameRoomManager.addPlayer(new Player("test0"), 2);
        gameRoomManager.addPlayer(new Player("test1"), 2);
        let player = gameRoomManager.findPlayerByUsername("test0");
        expect(player.username).to.equal("test0");
    });

});




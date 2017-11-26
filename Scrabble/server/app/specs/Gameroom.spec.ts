import { expect } from 'chai';
import { GameRoom } from '../classes/GameRoom';
import { Player } from '../classes/player';
import { GameRoomManager } from '../classes/gameRoomManager';

describe('Test de la classe GameRoom', function () {

    let gameRoomManager: GameRoomManager;
    let gameRoom: GameRoom;
    let capacity: number;
    beforeEach(() => {
        gameRoomManager = new GameRoomManager();
        gameRoom = new GameRoom(capacity);
    });

    it('Should find player by username', function () {
        gameRoomManager.addPlayer(new Player("test0"), 2);
        gameRoomManager.addPlayer(new Player("test1"), 2);
        let player = gameRoom.findPlayerByUsername("test1");
        expect(player.username).to.equal("test1");
    });

    it('Should removePlayer', function () {
        gameRoomManager.addPlayer(new Player("test0"), 2);
        gameRoomManager.addPlayer(new Player("test1"), 2);
        let playerList1 = gameRoom.players.length;
        gameRoom.removePlayer("test1");
        let playerList2 = gameRoom.players.length;
        expect(playerList1).to.equal(playerList2);
    });
    it('Should missingPlayer', function () {
        gameRoomManager.addPlayer(new Player("test0"), 2);
        expect(gameRoom.missingPlayer).to.equal(1);
    });


    it('Should isFul', function () {
        gameRoomManager.addPlayer(new Player("test0"), 2);
        gameRoomManager.addPlayer(new Player("test1"), 2);
        expect(gameRoom.isFull).to.equal(true);
    });

    it('Should playerExist', function () {
        gameRoomManager.addPlayer(new Player("test0"), 2);
        gameRoomManager.addPlayer(new Player("test1"), 2);
        let player1 = gameRoom.findPlayerByUsername("test1");
        let player2 = gameRoom.findPlayerByUsername("test1");
        expect(player1.username).to.equal(player2.username);
    });
});




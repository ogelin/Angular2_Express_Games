import { expect } from 'chai';
import {Player} from '../classes/player';
import {Easel} from '../classes/easel';
import { ExchangeCommand } from '../classes/exchange-command';
import { GameRoomManager } from '../classes/GameRoomManager';
import * as io from 'socket.io';
import * as sinon from 'sinon';
describe('Test de la classe putCommand', function () {

    let command: ExchangeCommand;
    let server = io() as SocketIO.Server;
    let gameRoomManager: GameRoomManager;

    sinon.stub(server, 'emit', (event: string, data: any): void => {
        console.log('Overriding event ' + event + "with values : ");
        console.log(data);
    });

    beforeEach(() => {
        gameRoomManager = new GameRoomManager();
        command = new ExchangeCommand(server, undefined, undefined, gameRoomManager);
    });

    it('Should exchange some letters on the player easel', function () {
        command.gameRoomManager.addPlayer(new Player("user", ""), 2);
        command.gameRoomManager.addPlayer(new Player("salut", ""), 2);

        let player = command.gameRoomManager.findPlayerByUsername("salut");
        player.easel = new Easel(["t", "a", "b", "l", "e", "a", "b"]);
        let easel = player.easel;

        let easelCopy = new Easel();

        for (let i = 0; i < easel.tiles.length; i++){
           easelCopy.tiles.push(easel.tiles[i]);
        }
        command.exchangeProcess("table", "salut");
        let same = true;

        for (let i = 0; i < player.easel.tiles.length; i++){
            if (player.easel.tiles[i].letter !== easelCopy.tiles[i].letter){
                same = false;
            }
        }

        expect(same).to.be.false;

    });

     it('Should NOT exchange some letters on the player easel', function () {
        command.gameRoomManager.addPlayer(new Player("user", ""), 2);
        command.gameRoomManager.addPlayer(new Player("salut", ""), 2);

        let player = command.gameRoomManager.findPlayerByUsername("salut");
        player.easel = new Easel(["t", "a", "b", "l", "e", "a", "b"]);
        let easel = player.easel;

        let easelCopy = new Easel();

        for (let i = 0; i < easel.tiles.length; i++){
           easelCopy.tiles.push(easel.tiles[i]);
        }
        command = new ExchangeCommand(server, "sable", "salut", command.gameRoomManager);
        let same = true;

        for (let i = 0; i < player.easel.tiles.length; i++){
            if (player.easel.tiles[i].letter !== easelCopy.tiles[i].letter){
                same = false;
            }
        }

        expect(same).to.be.true;

    });



});



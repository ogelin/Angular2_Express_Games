import { expect } from 'chai';
import { PutCommand } from '../classes/put-command';
import { GameRoomManager } from '../classes/GameRoomManager';
import { Letter } from '../classes/letter';
import { Grid } from '../classes/grid';
import {Easel} from '../classes/easel';
import {Player} from '../classes/player';
import * as io from 'socket.io';
import * as sinon from 'sinon';
describe('Test de la classe putCommand', function () {

    let command: PutCommand;
    let word: Array<Letter>;
    let grid: Grid;
    let server = io() as SocketIO.Server;
    let gameRoomManager: GameRoomManager;

    sinon.stub(server, 'emit', (event: string, data: any): void => {
        console.log('Overriding event ' + event + "with values : ");
        console.log(data);
    });

    beforeEach(() => {
        command = new PutCommand(server, undefined, undefined, gameRoomManager);
        word = new Array<Letter>();
        grid = new Grid();
        gameRoomManager = new GameRoomManager();
    });

    it('should say A is 1', function () {
        expect(command.letterToNumberIndex("A")).to.be.equal(1);
    });

    it('should return row of command', function () {
        let c: string;
        c = "!placer l8h reve";
        expect(command.getRow(c)).to.equal(11);
    });

    it('should return col of command', function () {
        let c: string;
        c = "!placer l8h reve";
        expect(command.getCol(c)).to.equal(7);
        c = "!placer g10h reve";
        expect(command.getCol(c)).to.equal(9);
        c = "!placer h2h reve";
        expect(command.getCol(c)).to.equal(1);
        c = "!placer h2v reve";
        expect(command.getCol(c)).to.equal(1);
        c = "!placer c15v reve";
        expect(command.getCol(c)).to.equal(14);
    });

    it ('should be horizontal', function() {
        expect(command.getOrientation("!placer h8h allo")).to.be.equal("h");
    });

    it ('should get word', function (){
        expect(command.getWord("!placer h8h allo")).to.be.equal("allo");
    });

    it ('should process text', function(){
        expect(command.textProcess("!placer h8h allo").length).to.be.equal(3);
    });

    it('should be stubbed', function () {
        command.testEmit();
    });

    it('should start at center', function () {
        command.gameRoomManager.addPlayer(new Player("user", ""), 2);
        command.gameRoomManager.addPlayer(new Player("salut", ""), 2);
        expect(command.startAtCenter("h", "allo", "salut").content[7][7]).to.be.equal("a");
    });
    it('should adjust score when word is placed', function () {
        command.gameRoomManager.addPlayer(new Player("user", ""), 2);
        command.gameRoomManager.addPlayer(new Player("salut", ""), 2);
        command.fixUpPoints(1, 1, "v", "table", "salut", this.grid);
        let player = command.gameRoomManager.findPlayerByUsername("salut");
        expect(player.score).to.not.equal(0);
    });
    it('should adjust easel when word is placed', function () {
        command.gameRoomManager.addPlayer(new Player("user", ""), 2);
        command.gameRoomManager.addPlayer(new Player("salut", ""), 2);
        let easel = new Easel();
        let player = command.gameRoomManager.findPlayerByUsername("salut");
        for (let i = 0; i < player.easel.tiles.length; i++){
            easel.tiles.push(player.easel.tiles[i]);
        }
        command.fixUpEasel(1, 1, "v", "table", "salut");
        expect(player.easel).to.not.equal(easel);
    });
    it('should add word to grid', function(){
        command.gameRoomManager.addPlayer(new Player("user", ""), 2);
        command.gameRoomManager.addPlayer(new Player("salut", ""), 2);
        expect(command.putWord(1, 1, "h", "table", "salut").content[1][1]).to.be.equal("t");
    });
    it('should NOT add word to grid', function(){
        command.gameRoomManager.addPlayer(new Player("user", ""), 2);
        command.gameRoomManager.addPlayer(new Player("salut", ""), 2);
        let gr = command.gameRoomManager.findRoomByPlayerUsername("salut").grid;
        let easel = command.gameRoomManager.findPlayerByUsername("salut").easel;
        let gridCopy = new Grid();
        let easelCopy = new Easel();

        for (let i = 0; i < easel.tiles.length; i++){
            easelCopy.tiles.push(easel.tiles[i]);
        }

        for (let i = 0; i < gr.content.length; i++){
            for (let j = 0; j < gr.content[i].length; j++){
                gridCopy.content[i][j] = gr.content[i][j];
            }
        }

        for (let i = 0; i < gridCopy.content.length; i++){
            for (let j = 0; j < gridCopy.content[i].length; j++){
                expect(command.temporaryPlacement(gridCopy, easelCopy,
                 "salut", "table").content[i][j]).to.equal(gridCopy.content[i][j]);
            }
        }
    });

});



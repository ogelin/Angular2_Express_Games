import { WordValidator } from './word-validator';
import { GameRoomManager } from '../classes/GameRoomManager';
import { Grid } from './grid';
import { Letter } from './letter';
import { ScoreCalculator } from './score-calculator';
import { BOARD, MESSAGES } from './commands';
import { GridBonus } from './gridBonus';
import { Easel } from './easel';

export class PutCommand {


    socket: SocketIO.Server;
    gameRoomManager: GameRoomManager;
    scoreCalculator = new ScoreCalculator();
    wordValidator: WordValidator;
    gridB: GridBonus;

    constructor(socket?: SocketIO.Server, cmd?: string, username?: string, gameRoomManager?: GameRoomManager) {
        this.socket = socket;
        this.gameRoomManager = gameRoomManager;
        this.wordValidator = new WordValidator(gameRoomManager);
        if (socket !== undefined && cmd !== undefined && username !== undefined) {
            this.putProcess(cmd, username);
        }
    }

    /* processes commands of form " !placer g1h bonjour " */
    putProcess(cmd: string, username: string) {

        let room = this.gameRoomManager.findRoomByPlayerUsername(username);
        let grid = room.grid;

        let command = this.textProcess(cmd);
        let word = this.getWord(cmd);
        let placement = command[1];

        let numberPattern = /\d+/g; //to select number
        let row = this.letterToNumberIndex(placement[0]) - 1; //-1s to account for 0 index
        let col = + placement.match(numberPattern) - 1;

        let orientation = this.getOrientation(cmd);
        if (this.wordValidator.gridIsEmpty(grid.content)) {
            grid = this.startAtCenter(this.getOrientation(cmd), this.getWord(cmd), username);
        }
        else {
            grid = this.putWord(row, col, orientation, word, username);
        }
    }

    testEmit() {
        this.socket.emit("emit", "data");
    }

    fixUpEasel(row: number, col: number, orientation: string, word: string, username: string) {
        let bag = this.gameRoomManager.findRoomByPlayerUsername(username).bag;
        let room = this.gameRoomManager.findRoomByPlayerUsername(username);
        let easel = this.gameRoomManager.findPlayerByUsername(username).easel;

        let newLetters = this.scoreCalculator.extractNewLetters(row, col, orientation, word, room.grid.content);
        let letters = "";
        for (let i = 0; i < newLetters.length; i++) {
            letters += (newLetters[i].letter);
        }
        if (letters === ""){
            letters = word;
        }

        for (let i = 0; i < letters.length; i++) {
            let letter = (new Letter(letters.charAt(i)));
            if (!easel.contains(letter) && easel.contains(new Letter("*"))) {
                letter = (new Letter("*"));
            }
            if (!bag.isEmpty()) {
                easel.replaceTile(letter, bag.takeRandomTile());
            }
            else {
                easel.removeTile(letter);
                this.socket.to(room.id).emit("endOfGame", username);
            }
        }
        this.socket.to(room.id).emit("easelUpdate", {
            username: username,
            easel: easel, bagSize: bag.content.length
        });
    }

    fixUpPoints(row: number, col: number, orientation: string, word: string, username: string, grid: Array<Array<string>>) {
        let player = this.gameRoomManager.findPlayerByUsername(username);
        let score = this.scoreCalculator.totalPoints(row, col, orientation, word.toUpperCase(), grid);
        let room = this.gameRoomManager.findRoomByPlayerUsername(username);
        if (player.easel.tiles.length === 7 && word.length === 7) {
            player.score += 50;
            this.socket.to(room.id).emit("message", "BINGO +50 points");
        }
        else {
            player.score += score;
        }
        this.socket.to(room.id).emit("updateQueue", this.gameRoomManager.findRoomByPlayerUsername(username).players);
        // this.socket.emit("updateQueue", this.gameRoomManager.findRoomByPlayerUsername(username).players);
    }

    /*Tries to put the word on the board*/
    putWord(row: number, col: number, orientation: string, word: string, username: string): Grid {
        let grid = this.gameRoomManager.findRoomByPlayerUsername(username).grid;
        let player = this.gameRoomManager.findPlayerByUsername(username);
        let easel = player.easel;
        let room = this.gameRoomManager.findRoomByPlayerUsername(username);
        let gridCopy = new Grid();
        let easelC = new Easel();
        //save copy of grid for later in case word is invalid
        for (let i = 0; i < grid.content.length; i++) {
            for (let j = 0; j < grid.content[i].length; j++) {
                gridCopy.content[i][j] = grid.content[i][j];
            }
        }
        //save copy of easel for later in case word is invali
        for (let i = 0; i < easel.tiles.length; i++) {
            easelC.addTile(new Letter(easel.tiles[i].letter));
        }
        //initial check that word is valid
        if (!this.wordValidator.canPlayWord(word, orientation, row, col, username)) {
            this.socket.to(room.id).emit("problemWord", MESSAGES['wordProblem']);
            return gridCopy;
        }

        grid.addWord(row, col, orientation, word);
        //emit initial placement
        this.socket.to(room.id).emit("updateGrid", grid.content);
        //check placement is legal. if not go back to initial grid & easel
        if (!grid.validGridWords(grid.content)) {
            this.temporaryPlacement(gridCopy, easelC, username, word);
            return gridCopy;
        }
        player.easel = easelC;
        this.fixUpPoints(row, col, orientation, word, username, gridCopy.content);
        this.fixUpEasel(row, col, orientation, word, username);
        return grid;
    }

    /* Places word for 3 seconds, then resets board & easel to initial state*/
    temporaryPlacement(gridCopy: Grid, easelCopy: Easel, username: string, word: string): Grid {
        let player = this.gameRoomManager.findPlayerByUsername(username);
        let easel = player.easel;
        let room = this.gameRoomManager.findRoomByPlayerUsername(username);
        let bag = room.bag;
        let grid = this.gameRoomManager.findRoomByPlayerUsername(username).grid;

        easel.removeWord(word);
        this.socket.to(room.id).emit("easelUpdate", {
            username: username,
            easel: easel, bagSize: bag.content.length
        });
        this.socket.to(room.id).emit("updateQueue", room.players);

        for (let i = 0; i < grid.content.length; i++) {
            for (let j = 0; j < grid.content[i].length; j++) {
                grid.content[i][j] = gridCopy.content[i][j];
            }
        }
        let self = this;
        setTimeout(function () {
            //emits initial state from copies after 3 sec
            player.easel = easelCopy;
            self.socket.to(room.id).emit("problemWord", "Ce mot est illégal!");
            self.socket.to(room.id).emit("updateGrid", gridCopy.content);
            self.socket.to(room.id).emit("easelUpdate", {
                username: username,
                easel: easelCopy, bagSize: bag.content.length
            });
            self.socket.to(room.id).emit("updateQueue", room.players);
        }, 3000);
        return grid;
    }
    getRow(command: string): number {
        let c = this.textProcess(command);
        let placement = c[1];
        return this.letterToNumberIndex(placement[0]) - 1; //row
    }

    getCol(command: string): number {
        let c = this.textProcess(command);
        let placement = c[1];
        let numberPattern = /\d+/g; //to select number
        return + placement.match(numberPattern) - 1; //col//row

    }

    getOrientation(command: string): string {
        let c = this.textProcess(command);
        let place = c[1];
        return place[place.length - 1];
    }

    getWord(command: string): string {
        let c = this.textProcess(command);
        return c[c.length - 1];
    }

    startAtCenter(orientation: string, word: string, username: string): Grid {
        let room = this.gameRoomManager.findRoomByPlayerUsername(username);
        let grid = room.grid;
        if (this.wordValidator.canPlayWord(word, orientation, BOARD['middle'], BOARD['middle'], username)) {
            grid = this.putWord(BOARD['middle'], BOARD['middle'], orientation, word, username);
        }
        else {
            grid = new Grid();
            this.socket.to(room.id).emit("problemWord", MESSAGES['wordProblem']);
        }
        return grid;

    }

    /* gives number corresponding to letter, ex: A-> 1, B->2, etc*/
    letterToNumberIndex(letter: string): number {
        let rowCode = letter.toLowerCase().charCodeAt(BOARD.minIndex);
        let minCode = BOARD.minLetter.charCodeAt(BOARD.minIndex);
        return rowCode - minCode + 1;
    }
    /*initial processing of command string as written by client*/
    textProcess(cmd: string): Array<string> {
        let command = cmd.toLowerCase().trim().split(" ");
        return command;
    }

}



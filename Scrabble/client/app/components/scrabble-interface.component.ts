import { Component, OnInit, HostListener } from '@angular/core';
import { PlayerService } from '../services/player.service';
import { SocketService } from '../services/socket.service';
import { Player } from '../classes/player';
import { Row } from '../classes/row';
import { Easel, EVENTS } from '../classes/easel';
import { puzzle } from '../classes/mock-scrabble';
import { Router, ActivatedRoute } from '@angular/router';
import { Letter } from '../classes/letter';

export const DEFAULT_BAG_SIZE = 102;
export const STAR = 56;

@Component({
    selector: 'scrabble-interface',
    templateUrl: '/assets/templates/scrabble-interface.component.html',
    providers: [PlayerService, SocketService],
})

export class ScrabbleInterfaceComponent implements OnInit {


    scrabble: Array<Row> = puzzle;
    lastElement: string;
    players: Player[];
    handUsername: string;
    askHelp = false;
    messages: Array<string> = [];
    message = '';
    easel: Easel;
    easelFocus: boolean;
    chatFocus: boolean;
    needsInstructions = true;
    username: string;
    min: number;
    sec: number;
    bagSize = DEFAULT_BAG_SIZE;
    endOfGame = false;


    constructor(private router: Router, private activatedRoute: ActivatedRoute, private playerService?: PlayerService,
        private socketService?: SocketService) {
        this.easel = new Easel();
        this.easelFocus = false;
        this.chatFocus = true;
    }

    ngOnInit(): void {
        this.getscrabble();
        this.sendMessage();
        this.getMessage();
        this.getTimer();
        this.activatedRoute.params.subscribe(params => {
            this.username = params['username'];
        });
        this.getEasel();
        this.updatePlayerList();
        this.endGame();
    }

    getscrabble(): Array<Row> {
        return this.scrabble;
    }
    sendMessage(event?: KeyboardEvent) {

        if (event === undefined || event.keyCode === 13) { //if it's a click the event will be undefined

            if (this.message.trim()[0] === "!") {
                if (this.username === SocketService.players[0]) {
                    this.socketService.sendCommand(this.message, this.username);
                } else {
                    this.messages.push("C'est pas votre tour!");
                }
            }

            else {
                this.socketService.emitMessage("message",
                    { "username": SocketService.username, "message": this.message });
                // emit un message av.ec le username et le message comme data
            }
            this.message = ''; //clears the input box.

        }
    }

    helpCommand(command: string): void {

        if (command.trim()[0] === "!") {
            // verifier si this.username === au premier element de la liste static dans le socket
            this.socketService.sendCommand(command.trim().toLowerCase(), this.username);
            // Sinon
            // afficher un message dans le chatmessage
        }
    }

    getIndexValue(rowIndex: number, colIndex: number): number {
        const length = 16;
        return rowIndex * length + colIndex;
    }

    convertIndexValue(indexID: number): string {

        let indexCode = "";
        let nb = indexID % 16;
        let letter = indexID / 16;
        indexCode = letter + nb.toString();

        return indexCode;

    }

    isLetterInput(keyCode: number): boolean {
        return ((keyCode >= EVENTS.LETTER_A && keyCode <= EVENTS.LETTER_Z) || keyCode === STAR);
    }

    isArrowInput(keyCode: number): boolean {
        return (keyCode === EVENTS.LEFT_ARROW || keyCode === EVENTS.RIGHT_ARROW);
    }

    focusChange(): void {

        if (this.easelFocus) {
            //focus on chat
            this.easelFocus = false;
            this.chatFocus = true;
            let focusIndex = this.easel.getFocusIndex();

            let inputElement = <HTMLInputElement>document.getElementById("easel");
            inputElement.className += " unfocused";

            inputElement = <HTMLInputElement>document.getElementById("chatBox");

            if (inputElement.classList.contains("unfocused")) {
                inputElement.classList.remove("unfocused");
            }

            if (focusIndex !== -1) {
                let letter = <HTMLInputElement>document.getElementById("letter" + '' + focusIndex);
                letter.classList.remove('focused');
            }
        }

        else if (this.chatFocus) {
            //focus on easel
            this.easelFocus = true;

            let inputElement = <HTMLInputElement>document.getElementById("easel");

            if (inputElement.classList.contains("unfocused")) {
                inputElement.classList.remove("unfocused");
            }
            inputElement = <HTMLInputElement>document.getElementById("chatBox");
            inputElement.className += " unfocused";

            this.chatFocus = false;
        }
    }

    //TODO: check if the easel or the chatbox is in focus & consider tabs
    @HostListener('window:keydown', ['$event'])
    onKeyMove(event: KeyboardEvent) {

        if (event.keyCode === EVENTS.TAB) {
            this.focusChange();
            if (this.needsInstructions) {
                this.needsInstructions = false;
            }
        }
        if (event.keyCode === EVENTS.ESC) {
            this.exitGame();
        }
        // an element has to already be focused for the arrows to work
        if (this.easel.getFocusIndex() !== -1 && this.isArrowInput(event.keyCode) && this.easelFocus === true) {
            this.easel.arrowMove(event);
            SocketService.socketClient.emit("easelUpdate", this.username, this.easel);
        }
        else if (this.easelFocus === true && this.isLetterInput(event.keyCode)) {
            this.easel.letterChange(event);
        }
    }

    createBag() {
        //TODO?
    }

    exitGame(): void {
        this.router.navigate(['']);
        this.socketService.onDisconnect();
        SocketService.socketClient.emit("removePlayer", this.username);
        this.messages.push("le joueur", this.username, "a été enlevé de la partie");
    }

    private getMessage() {
        SocketService.socketClient.on("message", (data: { username: string, message: string }) => {
            this.messages.push(data.username + ": " + data.message);
        });
        //SocketService.socketClient.on("message", (message: string) => {
            //this.messages.push(message);
        //});
        SocketService.socketClient.on("helpMessage", (message: string) => {
            this.messages.push(message);
        });
        SocketService.socketClient.on("problemCommand", (message: string) => {
            this.messages.push(message);
        });
        SocketService.socketClient.on("wordError", () => {
            this.messages.push("Vous ne pouvez pas placer ce mot!");
        });
        SocketService.socketClient.on("problemWord", (message: string) => {
            this.messages.push(message);
        });
    }
    private getEasel() {
        //todo
        SocketService.socketClient.emit("needEasel", this.username);
        SocketService.socketClient.on("easelUpdate",

            (data: { username: string, easel: Easel, bagSize: number }) => {
                this.bagSize = data.bagSize;

                if (data.username === this.username) {
                    this.easel.tiles = new Array<Letter>();
                    for (let i = 0; i < data.easel.tiles.length; i++) {
                        this.easel.tiles.push(data.easel.tiles[i]);

                    }
                }
            });
    }

     endGame() {
         console.log("yoooooooooooooooooo");
        SocketService.socketClient.on("endOfGame", (username: string) => {
            this.endOfGame = true;
            console.log("endGame"+ username);
            
        });
        if(this.messages.length !== 0)
            window.alert("félicitation");
        this.endOfGame = true;

    }

    getBestPlayer(): string {
        let max = 0;
        let bestPlayer = "";
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].score > max) {
                max = this.players[i].score;
                bestPlayer = this.players[i].username;
            }
        }
        return bestPlayer;
    }

    private getTimer() {
        SocketService.socketClient.on("timer", (counter: { minutes: number, seconds: number }) => {
            this.min = counter.minutes;
            this.sec = counter.seconds;
        });
    }

    private updatePlayerList() {
        // ecraser le tableau des players avec le nouveau
        SocketService.socketClient.on("updateQueue", (playersUpdatelist: Array<Player>) => {
            let usernameList = new Array<string>();
            for (let i = 0; i < playersUpdatelist.length; i++) {
                usernameList[i] = playersUpdatelist[i].username;
            }
            SocketService.players = usernameList;
            this.players = playersUpdatelist;
            this.handUsername = SocketService.players[0];
        });
        SocketService.socketClient.on("newQueueUpdate", (playersUpdatelist: Array<Player>) => {
            let usernameList = new Array<string>();
            for (let i = 0; i < playersUpdatelist.length; i++) {
                usernameList[i] = playersUpdatelist[i].username;
            }
            SocketService.players = usernameList;
            this.players = playersUpdatelist;
            this.handUsername = SocketService.players[0];
        });
    }
}

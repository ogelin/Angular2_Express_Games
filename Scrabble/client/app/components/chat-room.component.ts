import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Player } from '../classes/Player';
import { PlayerService } from '../services/player.service';
import { SocketService } from '../services/socket.service';

@Component({
    selector: 'chat-room',
    templateUrl: '/assets/templates/chat-room.html',
    providers: [PlayerService, SocketService],
})

export class ChatRoomComponent implements OnInit {

    players: Player[];
    missingPlayers: number;
    currentUsername: string;
    player: Player;
    message: string;
    messages: Array<string> = [];

    getPlayers(): void {
        this.playerService.getPlayers().then(players => this.players = players);
    }

    ngOnInit(): void {
        this.players = new Array<Player>();
        this.getPlayers();
        this.playerJoinRoom();
        this.sendMessage();
        this.getGessage();
        this.getMissing();
    }

    constructor(private router: Router, private playerService: PlayerService,
        private socketService: SocketService, private activatedRoute: ActivatedRoute) { }


    private playerJoinRoom() {
        SocketService.socketClient.on("joinRoom", (data: {
            'roomId': number, 'missing': number,
            "isReady": boolean, 'username': string
        }) => {
            if (data.isReady) {
                this.router.navigate(['scrabble-interface', this.currentUsername]);
            }

        });
    }

    sendMessage(event?: KeyboardEvent) {

        if (event === undefined || event.keyCode === 13) { //if it's a click the event will be undefined

            this.socketService.emitMessage("message",
                { "username": SocketService.username, "message": this.message });
            // emit un message av.ec le username et le message comme data
            this.message = ''; //clears the input box.

        }
    }

    exitGame(event?: KeyboardEvent): void {
        if (event.keyCode === 27) {//esc key
            this.router.navigate(['']);
        }
    }

    private getGessage() {
        SocketService.socketClient.on("message", (data: { username: string, message: string }) => {
            this.messages.push(data.username + ": " + data.message);
        });
    }
    getMissing(): void {
        this.activatedRoute.params.subscribe(params => {
            this.missingPlayers = params['missing'];
            this.currentUsername = params['username'];
        });
    }

}

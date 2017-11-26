import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Player } from '../classes/Player';
import { PartyType } from '../classes/party-type';
import { PlayerService } from '../services/player.service';
import { SocketService } from '../services/socket.service';

const enum PARTYTYPE {
    PLAYERS2 = 2,
    PLAYERS3 = 3,
    PLAYERS4 = 4,
}
@Component({
    selector: 'login-form',
    templateUrl: '/assets/templates/login-form.component.html',
    providers: [PlayerService, SocketService],
})

export class LoginFormComponent implements OnInit {

    players: Player[];
    noName = false;
    partyTypes = [new PartyType(2)];
    partyType = "2players";
    username: string;
    nbPlayer: string;
    isPresent = false;
    messages: Array<string> = [];

    getPlayers(): void {
        this.playerService.getPlayers().then(players => this.players = players);
    }

    ngOnInit(): void {
        this.getPlayers();
        this.checkUsernameExist();
        this.playerJoinRoom();
    }

    constructor(private router: Router, private playerService: PlayerService, private socketService: SocketService) { }

    addPlayer(username: string): void {
        if (username) {

            // Recuperer le number de joueur ici
            this.socketService.emitMessage("login", { 'username': username, 'numberOfPlayers': this.pickParty() });
            this.username = username;
            this.noName = false;
        }
        else {
            this.noName = true;
        }
    }

    checkName() {
        return this.noName;
    }

    private checkUsernameExist() {
        SocketService.socketClient.on("usernameExist", (data: string) => {
            this.isPresent = true;
        });
    }

    private playerJoinRoom() {
        SocketService.socketClient.on("joinRoom", (data: {
            'roomId': number, 'missing': number,
            "isReady": boolean, 'username': string
        }) => {
            SocketService.username = this.username;

            if (data.isReady) {
                this.router.navigate(['scrabble-interface', data.username]);
            } else {
                this.router.navigate(['chat-room', data.username, data.missing]);
            }
        });
    }

    private pickParty(): number {
        if (this.nbPlayer === "4") {
            this.partyType = "4players";
            this.partyTypes[2] = new PartyType(4);
            return PARTYTYPE.PLAYERS4;
        }
        else if (this.nbPlayer === "3") {
            this.partyType = "3players";
            this.partyTypes[1] = new PartyType(3);
            return PARTYTYPE.PLAYERS3;
        }
        else if (this.nbPlayer === "2") {
            this.partyType = "2players";
            this.partyTypes[0] = new PartyType(2);
            return PARTYTYPE.PLAYERS2;
        }

    }

}

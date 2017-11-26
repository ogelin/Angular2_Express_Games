import * as io from "socket.io-client";
import { ActivatedRoute } from '@angular/router';
import { Injectable } from '@angular/core';
import { Helper } from '../classes/helper';


@Injectable()
export class SocketService {
    static socketClient: SocketIOClient.Socket;
    static username: string;
    static players: Array<string>;

    serverleUrl = 'http://localhost:3002';
    message = '';
    constructor(private activatedRoute: ActivatedRoute) {
        let username: string;
        this.activatedRoute.params.subscribe((param => {
            username = param["username"];
        }));
        if (SocketService.socketClient === undefined) {
            SocketService.socketClient = io.connect(this.serverleUrl);
        }
        SocketService.players = new Array<string>();
        this.updateGrid();
    }

    updateGrid() {
        SocketService.socketClient.on("updateGrid", (grid: Array<Array<string>>) => {
            let helper = new Helper();
            let gr = helper.convertScrabbleFormat(grid);
            helper.copyToPuzzle(gr);
        });
    }
    sendMessage() {
        SocketService.socketClient.emit("message", this.message);
        this.message = '';
    }

    sendCommand(command: string, username: string) {
        SocketService.socketClient.emit("command", { command: command, username: username });
    }

    emitMessage(eventType: string, message: Object) {
        SocketService.socketClient.emit(eventType, message);
    }

    onDisconnect(){
        SocketService.socketClient.disconnect();
    }
}


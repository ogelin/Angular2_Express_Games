import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as io from 'socket.io-client';

@Injectable()
export class SocketService {
    static socketClient: SocketIOClient.Socket;
    serverUrl = 'http://localhost:3002';

    constructor(private activatedRoute: ActivatedRoute) {
        let username: string;
        this.activatedRoute.params.subscribe((param => {
            username = param["username"];
        }));

        if (SocketService.socketClient === undefined) {
            // connect and send the player username
            SocketService.socketClient = io.connect(this.serverUrl, { "query": "username=" + username });
        }
    }
}

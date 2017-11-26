import * as io from 'socket.io';
import * as http from "http";

import * as DatabaseManagerService from '../services/database-manager.service';

const TEN_SEC = 10000;

export class SocketManager {

    private databaseManager: DatabaseManagerService.DatabaseManager;
    private ioSocket: SocketIO.Server;
    private ioSocketClient: SocketIO.Socket;

    constructor(server: http.Server) {
        this.ioSocket = io.listen(server);
        this.databaseManager = DatabaseManagerService.DatabaseManager.getInstance();
        this.initializeEventListeners();
    }

    private initializeEventListeners() {
        this.ioSocket.on("connection", (socket: SocketIO.Socket) => {
            this.ioSocketClient = socket;

            let username = this.ioSocketClient.handshake.query["username"];
            console.log('client: ', username, 'connected');

            // disconnect the player when loose connection
            this.onDisconnectEvent();
        });
    }

    private onDisconnectEvent() {
        this.ioSocketClient.on("disconnect", () => {
            console.log("Wait for connection, it may be a page refresh...");

            // wait 10 sec, and check the disconnection before disconnect the Player
            setTimeout(() => {
                if (this.ioSocketClient.disconnected) {
                    let username = this.ioSocketClient.handshake.query["username"];
                    console.log('client: ', username, 'disconnected : ', this.ioSocketClient.disconnected);
                    this.databaseManager.disconnectPlayer(username);
                }
            }, TEN_SEC);

        });
    }
}

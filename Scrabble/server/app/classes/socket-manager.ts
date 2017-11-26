
import * as io from 'socket.io';
import * as http from 'http';
import { Player } from '../classes/player';
import { GameRoomManager } from '../classes/gameRoomManager';
import { Command } from '../classes/commands';
import { Easel } from '../classes/easel';
import { Letter } from '../classes/letter';

const TEN_SEC = 1000;

export class SocketManager {
    ioSocket: SocketIO.Server;
    gameRoomManager: GameRoomManager;


    constructor(server: http.Server) {
        this.ioSocket = io.listen(server);
        this.gameRoomManager = new GameRoomManager();
        this.connectionOn();
    }

    public connectionOn() {
        this.ioSocket.on("connection", (socket: SocketIO.Socket) => {
            this.loginOn(socket);
            this.playerMessage(socket);
            this.commandUse(socket);
            this.disconnectionOn(socket);
            this.easelChange(socket);
        });
    }

    public loginOn(socket: SocketIO.Socket) {
        socket.on("login", (loginInfo: { 'username': string, numberOfPlayers: number }) => {
            // verifier si le username si le username est disponible
            let tempPlayer = this.gameRoomManager.findPlayerByUsername(loginInfo.username);

            if (tempPlayer === undefined) {

                let player = new Player(loginInfo.username, socket.id);
                let gameRoom = this.gameRoomManager.addPlayer(player, loginInfo.numberOfPlayers);
                socket.join(gameRoom.id);
                this.ioSocket.to(gameRoom.id).emit("joinRoom",
                    {
                        'roomId': gameRoom.id, 'missing': gameRoom.missingPlayer(),
                        "isReady": gameRoom.isFull(), 'username': player.username
                    });

                if (gameRoom.isFull()) {
                    gameRoom.invertRound();
                    this.ioSocket.to(gameRoom.id).emit("updateQueue", gameRoom.players);
                   /* this.ioSocket.emit("updateQueue", gameRoom.players);*/
                    gameRoom.timer.startTimer().subscribe((counter) => {

                        this.ioSocket.to(gameRoom.id).emit("timer", counter);
                    });
                }

            } else {
                socket.emit("usernameExist", "");
            }
        });
    }

    public playerMessage(socket: SocketIO.Socket) {
        socket.on("message", (data: { username: string, message: string }) => {
            let gameRoom = this.gameRoomManager.findRoomByPlayerUsername(data.username);
            // find Gameroom by username
            if (gameRoom !== undefined && data.message !== undefined
                && data.message.trim()[0] !== "!") {
                this.ioSocket.to(gameRoom.id).emit("message", data);
            }

            // disconnect the player when lose connection
        });
    }

    public commandUse(socket: SocketIO.Socket) {
        socket.on("command", (data: { command: string, username: string }) => {
            // Obtenir l room du player
            let gameRoom = this.gameRoomManager.findRoomByPlayerUsername(data.username);

            if (gameRoom !== undefined) {
                // changer lordre de priorite dans sa room
                gameRoom.invertRound();
                // retourner la nouvelle liste de priorite aux joueurs

                gameRoom.initTimer();

                this.ioSocket.to(gameRoom.id).emit("updateQueue", gameRoom.players);
            }
            if (gameRoom === undefined) {
                return; //this doesn't really do anything except prevent the server from crashing
            }
            new Command(this.ioSocket, data.command, data.username, this.gameRoomManager);
        });
    }

    easelChange(socket: SocketIO.Socket) {
        socket.on("needEasel", (username: string) => {
            if (username !== undefined && username !== null) {
                let player = this.gameRoomManager.findPlayerByUsername(username);
                if (player !== undefined) {
                    let room = this.gameRoomManager.findRoomByPlayerUsername(username);
                    let eas = this.gameRoomManager.findPlayerByUsername(username).easel;
                    let bag = this.gameRoomManager.findRoomByPlayerUsername(username).bag;
                    let size = bag.content.length;
                    this.ioSocket.to(room.id).emit("easelUpdate", { username: username, easel: eas, bagSize: size });
                }
            }
        });
        socket.on("easelUpdate", (username: string, easel: Easel) => {
            if (username !== undefined && easel !== undefined) {
                let user = this.gameRoomManager.findPlayerByUsername(username);
                user.easel.tiles = new Array<Letter>();
                for (let i = 0; i < easel.tiles.length; i++) {
                    user.easel.tiles.push(easel.tiles[i]);
                }
            }
        });
    }


    public disconnectionOn(socket: SocketIO.Socket) {

        socket.on("disconnect", () => {
            setTimeout(() => {
                if (socket.disconnected) {
                    console.log("client disconnected!", socket.disconnected);
                }
            }, TEN_SEC);
            // get gameRoom of the player by socket id
            let gameRoom = this.gameRoomManager.findRoomBySocketId(socket.id);

            if (gameRoom) {

                let player = this.gameRoomManager.findPlayerBySocketId(socket.id);
                gameRoom.removePlayer(player.username);
                // Si la room est vide,
                if (gameRoom.capacity === 0) {
                    this.gameRoomManager.removeRoom(gameRoom);
                }
                this.ioSocket.to(gameRoom.id).emit("newQueueUpdate", gameRoom.players);
            }


        });
    }
}

import { GameRoom } from './GameRoom';
import { Player } from './player';
import { EASEL_DEFAULT_LENGTH } from './easel';


/**
 * GameRoomManager
 */
export class GameRoomManager {
    gameRooms: Array<GameRoom>;
    constructor() {
        this.gameRooms = new Array<GameRoom>();
    }

    public addPlayer(player: Player, numberOfPlayers: number): GameRoom {

        // recuperer une GameRoom avec avec capacite ===numberOfPlayers et isFull==false
        let gameRoom = this.findAvailableRoom(numberOfPlayers);
        if (gameRoom === undefined) {
            // si on ne trouve pas
            // creer une nouvelle GameRoom
            gameRoom = new GameRoom(numberOfPlayers);
            this.gameRooms.push(gameRoom);
        }
        gameRoom.players.push(player);
        for (let i = 0; i < EASEL_DEFAULT_LENGTH; i++) {
            player.easel.tiles.push(gameRoom.bag.takeRandomTile());
        }

        if (gameRoom.isFull) {
            gameRoom.randomizePlayersList();
        }
        return gameRoom;
    }

    /**
     * findAvailableRoom
     */
    public findAvailableRoom(numberOfPlayers: number): GameRoom {
        let tempRoom: GameRoom;
        this.gameRooms.forEach(gameRoom => {
            if (gameRoom.capacity === numberOfPlayers && !gameRoom.isFull()) {
                tempRoom = gameRoom;
            }
        });

        return tempRoom;
    }
    public findRoomByPlayerUsername(username: string): GameRoom {
        let tempRoom: GameRoom;
        this.gameRooms.forEach(gameRoom => {
            if (gameRoom.playerExist(username)) {
                tempRoom = gameRoom;
            }
        });

        return tempRoom;
    }

    public findPlayerByUsername(username: string): Player {
        let tempPlayer: Player;

        this.gameRooms.forEach(gameRoom => {
            gameRoom.players.forEach(player => {
                if (player.username === username) {
                    tempPlayer = player;
                }
            });
        });

        return tempPlayer;
    }

    public findRoomBySocketId(socketId: string): GameRoom {
        let tempRoom: GameRoom;
        this.gameRooms.forEach(gameRoom => {
            gameRoom.players.forEach(player => {
                if (player.socketId === socketId) {
                    tempRoom = gameRoom;
                }
            });
        });

        return tempRoom;
    }

    public findPlayerBySocketId(socketId: string): Player {
        let tempPlayer: Player;

        this.gameRooms.forEach(gameRoom => {
            gameRoom.players.forEach(player => {
                if (player.socketId === socketId) {
                    tempPlayer = player;
                }
            });
        });

        return tempPlayer;
    }

    public removeRoom(gameRoom: GameRoom) {
        for (let index = 0; index < this.gameRooms.length; index++) {
            if (this.gameRooms[index] === gameRoom) {
                this.gameRooms.splice(index, 1);
            }
        }
    }

}

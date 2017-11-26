import {GameRoomManager} from '../classes/GameRoomManager';
import {Letter} from '../classes/letter';

export class ExchangeCommand{


    socket: SocketIO.Server;
    gameRoomManager: GameRoomManager;

    constructor(socket: SocketIO.Server, letters?: string, username?: string, gameRoomManager?: GameRoomManager){
            this.socket = socket;
            this.gameRoomManager = gameRoomManager;
    if (socket !== undefined && letters !== undefined && username !== undefined){
            this.exchangeProcess(letters, username);
        }
    }

    exchangeProcess(letters: string, username: string){

        let room = this.gameRoomManager.findRoomByPlayerUsername(username);
        let player = this.gameRoomManager.findPlayerByUsername(username);
        let bag = room.bag;
        let easel = player.easel;

        if (letters.length > bag.content.length){
            this.socket.to(room.id).emit("problemCommand", "Il n'y a pas assez de tuiles disponibles!");
            return;
        }
        for (let l = 0 ; l < letters.trim().length; l++){
            let letter = new Letter(letters.charAt(l));
            if (!easel.contains(letter)){
                this.socket.to(room.id).emit("problemCommand", "Vous n'avez pas toutes ces lettres sur le chevalet");
                break;
            }
            easel.replaceTile(letter, bag.takeRandomTile());
         }
        bag.addTiles(letters);
        this.socket.to(room.id).emit("easelUpdate", {username: username, easel: easel,
             bagSize: bag.content.length});
        this.socket.to(room.id).emit("updateQueue", room.players);
    }
}

import { Easel } from './easel';
import { ExchangeCommand } from './exchange-command';
import {PutCommand} from './put-command';
import { GameRoomManager } from './gameRoomManager';

export let ORIENTATIONS = {
    'horizontal': "h",
    'vertical': "v"
};

export let BOARD = {
    'maxLetter': 'o',
    'minLetter': 'a',
    'length': 16,
    'minIndex': 0,
    'middle': 7,
    'lengthGrid': 15
};

export let MESSAGES = {
    '!aide':
    `
Voici les commandes disponibles:
Pour placer un mot faire la commande: 
!placer ligne|colonne (h|v) mot 
La ligne et la colonne permettent de positionnner la 1ere lettre du mot.
Le h et le v signifient si le mot est à l'horizontale ou à la verticale");
Pour changer les lettres sur le chevalet faire la commande :
!changer lettre
Les lettres doivent être écrites en minuscule.
* est pour la case blanche
Pour passer son tour faire la commande :
!passer
`,

    'formatting':
    `
Cette commande ne suit pas le bon format. Essayez !aide pour voir les formats acceptables.   
`,

    'wordProblem':
    `
Ce mot n'est pas valide!.   
`,

};

export class Command {

    easel = new Easel();
    socket: SocketIO.Server;
    gameRoomManager: GameRoomManager;

    constructor(socket?: SocketIO.Server, cmd?: string, username?: string, gameRoomManager?: GameRoomManager) {
        //process command?

        if (socket !== undefined && cmd !== undefined && username !== undefined && gameRoomManager !== undefined) {
            this.socket = socket;
            this.gameRoomManager = gameRoomManager;
            this.process(socket, cmd, username);
        }
    }

    process(socket: SocketIO.Server, cmd: string, username: string) {
        let input = cmd.toLowerCase().trim().split(" ");
        let command = input[0].trim();

        if (command === "!placer") {
            if (input.length !== 3) {
                this.socket.emit("problemCommand", MESSAGES['formatting']);
            }
            else{
                new PutCommand(socket, cmd, username, this.gameRoomManager );
            }
        }
        else if (command === "!aide") {
            this.socket.emit("helpMessage", MESSAGES[command]);
        }
        else if (command === "!passer") {
            if (input.length !== 1) {
                this.socket.emit("problemCommand", MESSAGES['formatting']);
            }
        }
        else if (command === "!changer") {
            if (input.length !== 2) {
                this.socket.emit("problemCommand", MESSAGES['formatting']);
            }
            else {
                new ExchangeCommand(socket, input[1], username, this.gameRoomManager);
            }
        }
        else {
            this.socket.emit("problemCommand", MESSAGES['formatting']);
        }
    }
}

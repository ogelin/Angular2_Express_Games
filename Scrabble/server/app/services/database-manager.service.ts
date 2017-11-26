import { GameRoom } from '../classes/GameRoom';
let client = require('mongodb').MongoClient;
import { Player } from '../classes/player';
let url = 'mongodb://test:test@ds139360.mlab.com:39360/db_scrabble';

module DatabaseManagerService {
    export class DatabaseManager {

        private static instance: DatabaseManager;

        static getInstance(): DatabaseManager {
            if (DatabaseManager.instance === undefined) {
                DatabaseManager.instance = new DatabaseManager();
            }
            return DatabaseManager.instance;
        }

        public connectPlayer(player: Player) {
            return client.connect(url)
                .then(
                // Promesse tenue
                //Sprint collection: PLAYERS_SPRINT
                (db: any) => db.collection('PLAYERS').insertOne({
                    player: player,
                })
                    .then(() => db.close()),
                // Promesse rompue
                (err: any) => { throw "erreur"; });
        }

        public connectRoom(room: GameRoom) {
            return client.connect(url)
                .then(
                // Promesse tenue
                (db: any) => db.collection('ROOM').insertOne({
                    room: room,
                })
                    .then(() => db.close()),
                // Promesse rompue
                (err: any) => { throw "erreur"; });
        }

        public disconnectRoom(room: GameRoom): GameRoom {
            return client.connect(url)
                .then(
                // Promesse tenue
                (db: any) => db.collection('ROOM').deleteOne(
                    { room: room },
                )
                    .then(
                    (res: any) => {
                        db.close();
                    }),
                // Promesse rompue
                (err: any) => { throw "erreur"; });
        }

        public findPlayer(player: Player): Promise<Player> {
            return client.connect(url)
                .then(
                // Promesse tenue
                //Sprint collection: PLAYERS_SPRINT
                (db: any) => db.collection('PLAYERS').findOne(
                    { player: player }
                )
                    .then(
                    (res: any) => {
                        db.close();
                        if (res !== null) {
                            return Promise.resolve(res.player);
                        }
                        else {
                            return undefined;
                        }
                    }),
                // Promesse rompue
                (err: any) => { throw "erreur"; });

        }

        // delete the user from the DB when disconnect
        public disconnectPlayer(player: Player): Promise<Player> {
            return client.connect(url)
                .then(
                // Promesse tenue
                //Sprint collection: PLAYERS_SPRINT
                (db: any) => db.collection('PLAYERS').deleteOne(
                    { player: Player },
                )
                    .then(
                    (res: any) => {
                        db.close();
                    }),
                // Promesse rompue
                (err: any) => { throw "erreur"; });

        }
    }
}

export = DatabaseManagerService;

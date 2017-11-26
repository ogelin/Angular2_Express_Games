
import { Player } from '../classes/player';
import { PLAYERS } from '../data/players-data';

module PlayerManagerService {

    export class PlayerService {
        private loggedIn = false;
        isPresent = false;

        addPlayer(username: string): boolean {
            if (username) {
                this.isPresent = false;
                for (let player of PLAYERS) {
                    if (player.username === username) {
                        this.isPresent = true;
                        return this.isPresent;
                    }
                }

                if (!this.isPresent) {
                    PLAYERS.push(new Player(username));
                    return this.isPresent;
                }
            }
        }

        isLoggedIn() {
            if (PLAYERS.length !== 0) {
                this.loggedIn = true;
            }
            return this.loggedIn;
        }

        removePlayer(username: string) {
            //TODO
        }
    }
}

export = PlayerManagerService;

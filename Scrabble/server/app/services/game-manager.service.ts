import { Player } from '../classes/player';
import {GameRoom} from '../classes/GameRoom';

module GameManagerService{
    export class GameService{
        players: Player[];
        gamerooms: GameRoom[];
    }
}

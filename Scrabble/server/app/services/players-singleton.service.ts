import * as PlayerManagerService from './players-manager.service';

export class PlayerSingletonService {

    private static playerService: PlayerManagerService.PlayerService;

    public static getInstance(): PlayerManagerService.PlayerService {
        if ( PlayerSingletonService.playerService === undefined ) {
            PlayerSingletonService.playerService = new PlayerManagerService.PlayerService();
            return PlayerSingletonService.playerService;
        }

        return PlayerSingletonService.playerService;
    }
}

import { RenderService } from '../services/render.service';
import { CameraService } from '../services/camera.service';
import { ObjectCreaterService } from '../services/object-creater.service';
import { PlayerService } from '../services/player.service';
import { LevelsService } from '../services/levels.service';
import { LightService } from '../services/light.service';
import { GamePhysicsService } from '../services/game-physics.service';
import { EmitMessageService } from '../services/emit-message.service';
import { Object3DManagerService } from '../services/object3D-manager.service';
import { ScoreService } from '../services/score.service';
import { EndGameService } from '../services/end-game.service';
import { HudSceneService } from '../services/hud-scene.service';

import { ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { assert } from 'chai';
import * as SinonChai from 'sinon-chai';
chai.use(SinonChai);


describe('RenderService', () => {
    let http: Http;
    let renderService: RenderService;
    let cameraService: CameraService;
    let levelsService: LevelsService;
    let playerService: PlayerService;
    let activatedRoute: ActivatedRoute;
    let objectCreaterService: ObjectCreaterService;
    let lightService: LightService;
    let gamePhysicsService: GamePhysicsService;
    let object3DService: Object3DManagerService;
    let scoreService: ScoreService;
    let emitMessageService: EmitMessageService;
    let endGameService: EndGameService;
    let hudSceneService: HudSceneService;

    beforeEach(function () {
        cameraService = new CameraService();
        objectCreaterService = new ObjectCreaterService();
        levelsService = new LevelsService(http);
        lightService = new LightService();
        object3DService = new Object3DManagerService(objectCreaterService, lightService);
        gamePhysicsService = new GamePhysicsService(object3DService);
        scoreService = new ScoreService(playerService, levelsService, emitMessageService);
        emitMessageService = new EmitMessageService();
        endGameService = new EndGameService(scoreService, playerService);
        hudSceneService = new HudSceneService(scoreService, object3DService, levelsService, emitMessageService);

        renderService = new RenderService(cameraService, playerService, levelsService,
            activatedRoute, objectCreaterService, lightService, gamePhysicsService,
            object3DService, scoreService, emitMessageService, endGameService, hudSceneService);
    });

    it('Should always pass', function () {
        assert.isTrue(true);
    });

    describe('AbordLaunch', () => {

        it('Should abordLaunch for speed = 1', function () {
            assert.isTrue(renderService.abordLaunch(1));
        });

        it('Should  abordLaunch for speed = 0', function () {
            assert.isTrue(renderService.abordLaunch(0));
        });

        it('Should abordLaunch for speed = 5', function () {
            assert.isTrue(renderService.abordLaunch(5));
        });

        it('Should abordLaunch for speed = 10', function () {
            assert.isTrue(renderService.abordLaunch(10));
        });

        it('Should not abordLaunch for speed = 15', function () {
            assert.isFalse(renderService.abordLaunch(15));
        });

        it('Should not abordLaunch for speed = 16', function () {
            assert.isFalse(renderService.abordLaunch(16));
        });

        it('Should not abordLaunch for speed = 50', function () {
            assert.isFalse(renderService.abordLaunch(50));
        });

        it('Should not abordLaunch for speed = 100', function () {
            assert.isFalse(renderService.abordLaunch(100));
        });
    });
});

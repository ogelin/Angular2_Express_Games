import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { RenderService } from '../services/render.service';
import { LevelsService } from '../services/levels.service';
import { EmitMessageService } from '../services/emit-message.service';
import { SocketService } from '../services/socket.service';
import { PlayerService } from '../services/player.service';
import { ScoreService } from '../services/score.service';


import {
    EVENT,
} from '../classes/properties';

@Component({
    selector: 'my-gl',
    templateUrl: '/assets/templates/gl.component.html',
    providers: [LevelsService, SocketService],
})

export class GlComponent implements OnInit {
    webgltext: string;
    xmodel: number;
    ymodel: number;
    zCamera: number;
    isMouseDown = false;
    isMouseUp = false;
    speedInPercentage: number;
    speedBarColor: string;
    cursor: string;
    ready = false;
    private bestPlayerScore: any;


    ngOnInit(): void {
        this.webgltext = "";
        this.xmodel = this.ymodel = 0;
        this.zCamera = 0;
        this.speedInPercentage = 0;
        this.speedBarColor = 'primary';
    }

    constructor(private activatedRoute: ActivatedRoute, private levelsService: LevelsService,
        private router: Router, private socketService: SocketService, private renderService: RenderService,
        public emitMessageService: EmitMessageService, private playerService: PlayerService,
        private scoreService: ScoreService) {

        //receive a message from renderservice when all objects are created and the scene ready
        this.emitMessageService.event.subscribe((done: any) => {
            if (done.done === 'load') {
                this.ready = true;
            }
            if (done.done === 'cursor') {
                this.hideCursor();
            }
            if (done.done === 'bestScore') {
                this.setBestScore();
            }
            if (done.done === 'stoneStop') {
                this.showCursor();
            }
        });
    }

    sweeping() {
        if (this.isLaunch) {
            this.hideCursor();
        }
    }

    onMouseDown(event: MouseEvent) {
        this.hideCursor();
        let currentTimeInMs = new Date().getTime();
        if (event.button === EVENT.MOUSE_LEFT_BUTTON_CLICK && !this.isLaunch && !this.handOver) {
            this.isMouseDown = true;

            // wait 1ms and increaseSpeed
            setTimeout(() => {
                this.increaseSpeed(this.isMouseDown, currentTimeInMs);
            }, 1);
        }
    }

    onMouseUp() {
        this.showCursor();
        if (this.isMouseDown && !this.isLaunch) {
            if (!this.renderService.isLaunch) {
                this.renderService.initializeLaunchStone(this.speedInPercentage);
            }
            this.backTodefaulValue();
        }
    }

    private increaseSpeed(isMouseDown: boolean, currentTimeInMs: number): void {
        if (isMouseDown) {
            let diffInMs = new Date().getTime() - currentTimeInMs;
            this.speedInPercentage = this.getSpeedInPercentage(diffInMs);
            if (this.speedInPercentage >= 30 && this.speedInPercentage < 60) {
                this.speedBarColor = 'accent';
            }
            else if (this.speedInPercentage > 60) {
                this.speedBarColor = 'warn';
            }

            // wait 1ms and increaseSpeed
            setTimeout(() => {
                this.increaseSpeed(this.isMouseDown, currentTimeInMs);
            }, 1);

        }
    }

    public getSpeedInPercentage(timeMs: number): number {
        if (timeMs >= 3000) {
            timeMs = 3000;
        }

        let speedTemp = (timeMs / 30);
        speedTemp = Math.round(speedTemp);
        return speedTemp;
    }

    backTodefaulValue(): void {
        this.isMouseDown = false;
        this.isMouseUp = false;
        this.speedInPercentage = 0;
        this.speedBarColor = 'primary';
    }

    public get isLaunch(): boolean {
        return this.renderService.isLaunch;
    }

    get handOver(): boolean {
        return this.renderService.isRedStone;
    }

    public hideCursor() {
        this.cursor = 'nocursor';
    }

    public showCursor() {
        this.cursor = 'cursor';
    }

    public changeSpin() {
        this.renderService.changeSpin(this.isLaunch);
    }

    public restart(): boolean {
        return this.renderService.restart;
    }

    public restartGame(): void {
        this.renderService.reinitializeNewGame();
    }

    public homePage(): void {
        this.router.navigate(['game-interface', this.renderService.username]);
    }

    public setBestScore(): void {
        this.bestPlayerScore = null;
        this.scoreService.getBestScore().then((best) => {
            this.bestPlayerScore = best;
        });
    }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Level } from '../classes/level';
import { Player } from '../classes/player';

import { LevelsService } from '../services/levels.service';
import { PlayerService } from '../services/player.service';

const enum LEVEL {
    NORMAL = 0,
    HARD = 1,
}

@Component({
    moduleId: module.id,
    selector: 'login-form',
    templateUrl: '/assets/templates/login-form.component.html',
    providers: [PlayerService, LevelsService],
})


export class LoginFormComponent implements OnInit {
    levels = [new Level(0, "Normal")];
    myLevel = "";
    levelIsNormal = true;
    players: Player[];
    noName = false;
    isPresent = false;

    constructor(private router: Router, private playersService: PlayerService,
        private levelService: LevelsService) { }



    getPlayers(): void {
        this.playersService.getPlayers().then(players => this.players = players);
    }

    getLevel(): void {
        this.levelService.getLevel().then(levels => this.levels = levels);
    }

    pickLevel(selectLevel: number) {
        if (selectLevel === LEVEL.HARD) {
            this.myLevel = "difficile";
            this.levelIsNormal = false;
            this.levels[0] = new Level(1, "Difficile");
        }
        else {
            this.myLevel = "normal";
            this.levelIsNormal = true;
            this.levels[0] = new Level(0, "Normal");
        }
    }

    pickMyLevel() {
        if (this.myLevel.toLowerCase().trim() === "hard") {
            this.levels[0] = new Level(1, "Difficile");
            this.levelIsNormal = false;
        }
        else if (this.myLevel.toLowerCase().trim() === "normal") {
            this.levels[0] = new Level(0, "Normal");
            this.levelIsNormal = true;
        }
        else {
            this.levels[0] = new Level(0, "Normal");
            this.levelIsNormal = true;
        }
    }

    ngOnInit(): void {
        this.getPlayers();
        this.getLevel();
    }

    addPlayer(username: string, checkButton1: boolean, checkButton2: boolean): void {
        if (username && checkButton1 || checkButton2) {
            this.isPresent = false;
            username = username.trim();
            if (!username) { this.noName = true; return; }

            this.playersService.addPlayer(username)
                .then(estPresent => {
                    this.isPresent = estPresent['reponse'];
                    if (!this.isPresent) {
                        this.router.navigate(['glcomp', username]);
                    }
                })
                .catch(this.dontInsert);
            this.noName = false;
        }
        else {
            this.noName = true;
        }
    }

    checkName() {
        return this.noName;
    }

    public dontInsert(): void {
        this.isPresent = true;
    }
}

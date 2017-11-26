import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import { Level } from '../class/level';
import { PlayersService } from '../services/players.service';
import { LevelsService } from '../services/levels.service';

const enum LEVEL {
    NORMAL = 0,
    HARD = 1,
}

@Component({
    moduleId: module.id,
    selector: 'login-form',
    templateUrl: '/assets/templates/login-form.component.html',
    providers: [PlayersService, LevelsService],
})

export class LoginFormComponent implements AfterViewInit {
    levels = [new Level(0, "Normal")];
    isPresent = false;
    noName = false;
    myLevel = "normal";
    levelIsNormal = true;

    constructor(private router: Router, private playersService: PlayersService,
        private levelService: LevelsService) { }

    getLevel(): void {
        this.levelService.getLevel().then(levels => this.levels = levels);
    }

    addPlayer(username: string): void {
        if (username) {
            this.isPresent = false;
            username = username.trim();
            if (!username) { this.noName = true; return; }

            this.playersService.addPlayer(username)
                .then(estPresent => {
                    this.isPresent = estPresent['reponse'];
                    if (!this.isPresent) {
                        this.router.navigate(['grid-interface', username]);
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
    pickMyLevel(){
        if (this.myLevel.toLowerCase().trim() === "hard"){
            this.levels[0] = new Level(1, "Difficile");
            this.levelIsNormal = false;
        }
        else if (this.myLevel.toLowerCase().trim() === "normal"){
            this.levels[0] = new Level(0, "Normal");
            this.levelIsNormal = true;
        }
        else{
            this.levels[0] = new Level(0, "Normal");
            this.levelIsNormal = true;
        }
    }
    ngAfterViewInit(){
        this.getLevel();
    }
}

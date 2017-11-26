import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Level } from '../classes/level';
import { LevelsService } from '../services/levels.service';


const enum LEVEL {
    HARD = 1,
}

@Component({
    moduleId: module.id,
    selector: 'game-interface',
    templateUrl: '/assets/templates/new-game-interface.component.html',
    providers: [LevelsService],
})

export class NewGameInterfaceComponent implements OnInit {
    levels: Level[];
    inLevel = false;
    username: string;
    levelPick = false;

    constructor(private activatedRoute: ActivatedRoute, private levelsService: LevelsService, private router: Router)
    { }

    getLevel(): void {
        this.levelsService.getLevel().then(levels => this.levels = levels);
    }

    startGame(): void {
        this.router.navigate(['glcomp', this.username]);
        this.levelPick = false;
    }

    pickLevel(selectLevel: number) {
        if (selectLevel === LEVEL.HARD) {
            this.levels[0] = new Level(1, "Difficile");
        }
        else {
            this.levels[0] = new Level(0, "Normal");
        }
        this.inLevel = true;
    }

    getUsername(): void {
        this.activatedRoute.params.subscribe(params => {
            this.username = params['username'];
        });
    }

    ngOnInit(): void {
        this.getUsername();
        this.getLevel();
    }
}

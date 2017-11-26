import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { PlayersService } from '../services/players.service';
import { SudokuService } from '../services/sudoku.service';
import { LevelsService } from '../services/levels.service';
import { GridRow } from '../class/gridRow';
import { Level } from '../class/level';
import { Player } from '../class/player';
import { GridBloc } from '../class/gridBloc';
import { Timer } from '../class/timer';
import { LEVEL } from '../class/mock-levels';
import { SocketService } from '../services/socket.service';


const enum BLOC {
    LEFT_START = 0,
    LEFT_END = 2,
    CENTER_START = 3,
    CENTER_END = 5,
    DOWN_START = 6,
    DOWN_END = 8,
    LENGHT = 3,
    SIZE_SUDOKU = 81
}

const enum EVENTS {
    LEFT_ARROW = 37,
    UP_ARROW = 38,
    RIGHT_ARROW = 39,
    DOWN_ARROW = 40,
    ESC = 27,
    DELETE = 46
}

@Component({
    moduleId: module.id,
    selector: 'grid-interface',
    templateUrl: '/assets/templates/grid-interface.component.html',
    providers: [PlayersService, SudokuService, LevelsService, SocketService],
})

export class GridInterfaceComponent implements OnInit {
    private sudoku: Array<GridRow>;
    private duplicate = false;
    private youWon = false;
    private isbestPlayer = false;
    private player: Player;
    private levels: Level[] = [];
    private bestPlayerScore: any;
    private _timer: Timer = new Timer();

    startTimer() {
        this._timer.start();
    }
    stopTimer() {
        this._timer.stop();
    }
    resetTimer() {
        this._timer.reset();
    }

    // injection de dependance
    constructor(private playerService: PlayersService, private levelsService: LevelsService,
        private sudokuService: SudokuService, private router: Router,
        private activatedRoute: ActivatedRoute, private socketService: SocketService) {
    }

    getSudoku(): void {
        this.sudoku = null;
        this.sudokuService.getNewGrid(LEVEL[0].name)
            .then(sudoku => this.sudoku = sudoku);
    }

    getLevel(): void {
        this.levelsService.getLevel().then(levels => this.levels = levels);
    }

    reinitialise(): void {
        for (let row = 0; row < this.sudoku.length; row++) {
            for (let col = 0; col < this.sudoku[row].rowValue.length; col++) {
                if (this.sudoku[row].rowValue[col].isReadOnly === false) {
                    this.sudoku[row].rowValue[col].value = null;
                    let inputId = [row, col].join('');
                    document.getElementById(inputId).style.backgroundColor = "white";
                }
            }
        }
        this.resetTimer();
        this.youWon = false;
        this.isbestPlayer = false;
    }

    checkResult(): void {
        let i = 0;
        for (let row = 0; row < this.sudoku.length; row++) {
            for (let col = 0; col < this.sudoku[row].rowValue.length; col++) {
                if (this.sudoku[row].rowValue[col].value != null) {
                    i++;
                }
            }
        }
        if (i === BLOC.SIZE_SUDOKU) {
            this.stopTimer();
            let time = this._timer.min + ' ' + this._timer.sec;
            this.asTheBestScore(time);
        }
    }

    asTheBestScore(time: string): void {
        this.bestPlayerScore = null;
        this.isbestPlayer = false;
        this.playerService.checkBestScore(this.player.username, time, this.levelInEnglish(LEVEL[0].name))
            .then(arrayBestScore => {
                this.bestPlayerScore = arrayBestScore['response'];
                if (this.bestPlayerScore !== false) {
                    this.isbestPlayer = true;
                }
                else {
                    this.isbestPlayer = false;
                }
            })
            // TODO: Trouver le bon catch
            .catch(null);
    }

    levelInEnglish(level: string): string {
        if (level.toLowerCase() === "normal") {
            return "normal";
        }
        else {
            return "hard";
        }
    }

    startNewGame(): void {
        this.router.navigate(['game-interface', this.player.username]);
    }


    checkConflitRowCol(newInput: number, row: number, col: number): boolean {
        let colonne = 0, ligne = 0;

        if (newInput !== 0) {
            while (colonne < this.sudoku.length) {
                if (col !== colonne && this.sudoku[row].rowValue[colonne].value !== null &&
                    ((Number(this.sudoku[row].rowValue[colonne].value) === Number(newInput)))) {
                    return true;
                }
                if (row !== ligne && this.sudoku[ligne].rowValue[col].value !== null &&
                    (Number(this.sudoku[ligne].rowValue[col].value) === Number(newInput))) {
                    return true;
                }
                colonne++;
                ligne++;
            }
            return false;
        }
        return false;
    }

    searchCurrentBloc(row: number, col: number): GridBloc {
        let bloc = new GridBloc();
        bloc.colStart = Math.floor(col / BLOC.LENGHT) * BLOC.LENGHT;
        bloc.rowStart = Math.floor(row / BLOC.LENGHT) * BLOC.LENGHT;
        return bloc;
    }

    checkConflitBloc(row: number, col: number): boolean {
        if (this.sudoku[row].rowValue[col].value !== null) {
            let bloc = new GridBloc();
            bloc = this.searchCurrentBloc(row, col);
            for (let i = bloc.rowStart; i < bloc.rowStart + BLOC.LENGHT; i++) {
                for (let j = bloc.colStart; j < bloc.colStart + BLOC.LENGHT; j++) {
                    if (i !== row && j !== col && this.sudoku[i].rowValue[j].value !== null) {
                        if (Number(this.sudoku[row].rowValue[col].value) === this.sudoku[i].rowValue[j].value) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }
        return false;
    }

    removeDoublonColor(inputId: any, row: number, col: number): void {
        let colonne = 0, ligne = 0;

        while (colonne < this.sudoku.length) {
            inputId = [row, colonne].join('');
            if (document.getElementById(inputId).style.backgroundColor === "red") {
                this.duplicate = this.checkConflitRowCol(this.sudoku[row].rowValue[colonne].value, row, colonne);
                if (this.duplicate === false) {
                    document.getElementById(inputId).style.backgroundColor = "white";
                }

                this.duplicate = this.checkConflitBloc(row, colonne);
                if (this.duplicate === false) {
                    document.getElementById(inputId).style.backgroundColor = "white";
                }
            }

            inputId = [ligne, col].join('');
            if (document.getElementById(inputId).style.backgroundColor === "red") {
                this.duplicate = this.checkConflitRowCol(this.sudoku[ligne].rowValue[col].value, row, colonne);
                if (this.duplicate === false) {
                    document.getElementById(inputId).style.backgroundColor = "white";
                }

                this.duplicate = this.checkConflitBloc(row, colonne);
                if (this.duplicate === false) {
                    document.getElementById(inputId).style.backgroundColor = "white";
                }
            }
            colonne++;
            ligne++;
        }
    }

    /*checks if the grid is full of numbers*/
    isComplete(): boolean {
        let complete = false;
        let i = 0;
        for (let gridRow of this.sudoku) {
            for (let rowValue of gridRow.rowValue) {
                if (rowValue.value !== null) {
                    i++;
                }
            }
        }
        if (i === BLOC.SIZE_SUDOKU) {
            complete = true;
        }
        return complete;
    }

    /*checks if the grid is empty (it will be empty before we receive it from the server)*/
    isEmpty(): boolean {
        let empty = false;
        if (this.sudoku === null) {
            return true;
        }
        let i = 0;
        for (let gridRow of this.sudoku) {
            for (let rowValue of gridRow.rowValue) {
                if (rowValue.value !== null && rowValue.value !== 0) {
                    return false;
                }
            }
        }
        if (i === BLOC.SIZE_SUDOKU) {
            empty = true;
        }
        return empty;
    }

    allInputReadOnly(){
        for (let i = 0; i < document.getElementsByClassName("cell").length; i++ ) {
            document.getElementsByClassName("cell")[i].setAttribute("Readonly", "false");
        }
    }

    noPasting(newInput: string, row: number, col: number): void {
        let inputId = [row, col].join('');
        document.getElementById(inputId).innerHTML = "";
    }

    valideInput(newInput: string, row: number, col: number): void {
        let inputId = [row, col].join('');

        this.duplicate = this.checkConflitRowCol(Number(newInput), row, col);

        if (Number(newInput) !== 0) {
            this.sudoku[row].rowValue[col].value = Number(newInput);
        }

        if (!this.duplicate) {
            this.duplicate = this.checkConflitBloc(row, col);
            if (this.isComplete() && newInput.trim() !== "" && newInput.trim() !== null) {
                /* this is where we know the player won, so we stop the game */
                this.youWon = true;
                this.stopTimer();
                this.allInputReadOnly();
            }
        }

        if (this.duplicate) {
            inputId = [row, col].join('');
            if (document.getElementById(inputId).isContentEditable === true) {
                if (Number(newInput) !== 0) {
                    document.getElementById(inputId).style.backgroundColor = "red";
                }
            }
        }

        if (Number(newInput) === 0) {
            inputId = [row, col].join('');
            document.getElementById(inputId).style.backgroundColor = "white";
        }
        this.checkResult();
    }

    getUsername(): void {
        this.activatedRoute.params.subscribe(params => {
            this.player = new Player();
            this.player.username = params['username'];
        });
    }

    ngOnInit(): void {
        this.getUsername();
        this.getLevel();
        this.getSudoku();
        setTimeout(() => {
            this.startTimer();
        }, 5000); //loading time
    }

    onKeyMove(event: KeyboardEvent) {
        let eventSrcId = event.srcElement.id;
        let position = eventSrcId.split('');
        let row = Number(position[0]);
        let col = Number(position[1]);

        if (event.keyCode === EVENTS.LEFT_ARROW) {
            col = col - 1;
            if (col < 0) {
                col = BLOC.DOWN_END;
                row = row;
            }
        }
        else if (event.keyCode === EVENTS.RIGHT_ARROW) {
            col = col + 1;
            if (col > BLOC.DOWN_END) {
                col = 0;
                row = row;
            }
        }
        else if (event.keyCode === EVENTS.UP_ARROW) {
            row = row - 1;
            if (row < 0) {
                row = BLOC.DOWN_END;
                col = col;
            }
        }
        else if (event.keyCode === EVENTS.DOWN_ARROW) {
            row = row + 1;
            if (row > BLOC.DOWN_END) {
                row = 0;
                col = col;
            }
        }
        else if (event.keyCode === EVENTS.LEFT_ARROW) {
            col = col - 1;
            if (col < 0) {
                col = BLOC.DOWN_END;
                row = row;
            }
        }
        else if (event.keyCode === EVENTS.RIGHT_ARROW) {
            col = col + 1;
            if (col > BLOC.DOWN_END) {
                col = 0;
                row = row;
            }
        }
        else if (event.keyCode === EVENTS.UP_ARROW) {
            row = row - 1;
            if (row < 0) {
                row = BLOC.DOWN_END;
                col = col;
            }
        }
        else if (event.keyCode === EVENTS.DOWN_ARROW) {
            row = row + 1;
            if (row > BLOC.DOWN_END) {
                row = 0;
                col = col;
            }
        }
        else if (event.keyCode === EVENTS.ESC || event.keyCode === EVENTS.DELETE) {
            let inputElement = <HTMLInputElement>document.getElementById(row + '' + col);
            let inputId = [row, col].join('');
            if (document.getElementById(inputId).isContentEditable === true) {
                inputElement.value = null;
            }
        }
        let inpuElement = <HTMLInputElement>document.getElementById(row + '' + col);
        inpuElement.focus();
    }
}

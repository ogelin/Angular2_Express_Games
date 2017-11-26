import { GridRow } from '../classes/gridRow';

const enum BLOC{
    MIN = 0,
    MAX = 8
}


module caseRemover {

export class Remover{

    constructor() {
        //TODO
    }

    randomNumber(min: number, max: number): number {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

    putZero(grid : Array<GridRow>): Array<GridRow> {
            let nbCol = this.randomNumber(BLOC.MIN, BLOC.MAX);
            let nbRow = this.randomNumber(BLOC.MIN, BLOC.MAX);
            grid[nbRow].rowValue[nbCol].isReadOnly = false;
            grid[nbRow].rowValue[nbCol].value = 0;

            return grid;
        }
    }
}

export = caseRemover;

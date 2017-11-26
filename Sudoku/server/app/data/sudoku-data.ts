import { GridRow } from '../classes/gridRow';

export let NORMAL_SUDOKU_SOLUTIONS: Array<GridRow>[] = [];
export let NORMAL_EMPTY_SUDOKUS: Array<GridRow>[] = [];

export let DIFFICULT_SUDOKU_SOLUTIONS: Array<GridRow>[] = [];
export let DIFFICULT_EMPTY_SUDOKUS: Array<GridRow>[] = [];

// Copy only : DO NOT MODIFY
export const PUZZLE = [
    1, 2, 3, 4, 5, 6, 7, 8, 9,
    4, 5, 6, 7, 8, 9, 1, 2, 3,
    7, 8, 9, 1, 2, 3, 4, 5, 6,
    2, 3, 4, 5, 6, 7, 8, 9, 1,
    5, 6, 7, 8, 9, 1, 2, 3, 4,
    8, 9, 1, 2, 3, 4, 5, 6, 7,
    3, 4, 5, 6, 7, 8, 9, 1, 2,
    6, 7, 8, 9, 1, 2, 3, 4, 5,
    9, 1, 2, 3, 4, 5, 6, 7, 8,
];

import { expect } from 'chai';
import { Grid } from "../classes/grid";
import { GridBonus } from "../classes/gridBonus";


let gridB: GridBonus;
let gridG: Grid;

beforeEach(() => {
    gridB = new GridBonus();
    gridG = new Grid();
});

it('Should add the desired word at the desired position', function () {
    gridG.addWord(0, 3, "h", "ALLO");
    expect(gridG.returnLetter(0, 3)).to.equal("A");
});

it('Should return that word is valid', function () {
    let wordExist = gridG.validWord("TABLE");
    expect(wordExist).to.be.true;
});

it('Should return that word is invalid', function () {
    let wordExist = gridG.validWord("JDOIEWJFH");
    expect(wordExist).to.be.false;
});

it('Should return that grid is invalid (column conflict)', function () {
    gridG.addWord(0, 3, "h", "ALLO");
    gridG.addWord(1, 3, "h", "SALUT");

    expect(gridG.validGridWords(gridG.content)).to.be.false;
});

it('Should return that grid is valid', function () {
    gridG.addWord(0, 3, "h", "TABLE");
    gridG.addWord(1, 5, "v", "ALLE");

    expect(gridG.validGridWords(gridG.content)).to.be.true;
});

it('Should return that grid is valid', function () {
    gridG.addWord(0, 3, "h", "TABLE");
    gridG.addWord(2, 3, "v", "POMME");
    expect(gridG.validGridWords(gridG.content)).to.be.true;
});

it('Should return that grid is valid', function () {
    gridG.content = [
        ["t", "a", "b", "l", "e", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "c"/**/, "h", "a", "i", "s", "e", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["s", "a", "l", "u", "t", "", "", "", "", "", "", "", "", "", ""]
    ];
    expect(gridG.validGridWords(gridG.content)).to.be.true;
});



it('Should return that grid is invalid (row conflict)', function () {
    gridG.addWord(1, 3, "v", "ALLO");
    gridG.addWord(1, 4, "v", "SALUT");

    expect(gridG.validGridWords(gridG.content)).to.be.false;
});

it('Should find that rows are invalid', function () {
    gridG.addWord(1, 3, "v", "ALLO");
    gridG.addWord(1, 4, "v", "SALUT");

    expect(gridG.validateRowWords(gridG.content)).to.be.false;
});

it('Should transpose the matrix', function () {
    gridG.content = [
        ["a", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["b", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["c", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""/**/, "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    ];

    let gridGtransposed = new Grid();
    gridGtransposed.content = [
        ["a", "b", "c", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""/**/, "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    ];

    gridG.content = gridG.matrixTranspose(gridG.content);

    for (let i = 0; i < 15; i++){
        for (let j = 0; j < 15; j++){
            expect(gridG.content[i][j]).to.equal(gridGtransposed.content[i][j]);
        }
    }
});



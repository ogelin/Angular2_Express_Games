import { ScoreDB } from '../classes/scoreDB';
import * as Route from '../routes/index';

import { expect } from 'chai';

let scoresGame: number[] = [];
let bestScoresDB: Array<any> = [];
let username: string;
let scoreHuman = 0;
let scoreCPU = 0;
let newScore: ScoreDB;

bestScoresDB = [
    {
        "id": 1,
        "username": "player1",
        "scoreHuman": 0,
        "scoreCPU": 0
    },

    {
        "id": 2,
        "username": "player2",
        "scoreHuman": 0,
        "scoreCPU": 0
    },
    {
        "id": 3,
        "username": "player3",
        "scoreHuman": 0,
        "scoreCPU": 0
    },

];

describe('checkScoresRequirement', () => {
    it('should pass allaws ', () => {
        expect(true).to.equal(true);
    });

    it('should add scoreHuman 5, scoreCPU: 1 ', () => {
        scoreHuman = 5;
        username = 'mocha';
        scoreCPU = 1;
        scoresGame.push(scoreHuman);
        scoresGame.push(scoreCPU);
        newScore = Route.Index.checkScoresRequirement(scoresGame, bestScoresDB, username);
        bestScoresDB[scoresGame[2]].id = newScore.id;
        bestScoresDB[scoresGame[2]].username = newScore.usernamePlayer;
        bestScoresDB[scoresGame[2]].scoreHuman = newScore.scoreHuman;
        bestScoresDB[scoresGame[2]].scoreCPU = newScore.scoreCPU;
        expect(newScore).to.not.be.undefined;
    });

    it('id in newScore shoud be 1', () => {
        expect(newScore.id).to.equals(1);
    });

    it('scoreCPU in newScore shoud be 1', () => {
        expect(newScore.scoreCPU).to.equals(1);
    });

    it('scoreHuman in newScore shoud be 5', () => {
        expect(newScore.scoreHuman).to.equals(5);
    });

    it('usernamePlayer in newScore shoud be mocha', () => {
        expect(newScore.usernamePlayer).to.equals('mocha');
    });

    it('index where newScore will be added should be 0', () => {
        expect(scoresGame[2]).to.equals(0);
    });

    it('should not add scoreHuman 0, scoreCPU: 0 ', () => {
        scoresGame.pop();
        scoreHuman = 0;
        username = 'karma';
        scoreCPU = 0;
        scoresGame[0] = scoreHuman;
        scoresGame[1] = scoreCPU;
        newScore = Route.Index.checkScoresRequirement(scoresGame, bestScoresDB, username);
        expect(newScore).to.be.undefined;
    });

    it('should not add scoreHuman 0, scoreCPU: 5 ', () => {
        scoresGame.pop();
        scoreHuman = 0;
        username = 'karma';
        scoreCPU = 5;
        scoresGame[0] = scoreHuman;
        scoresGame[1] = scoreCPU;
        newScore = Route.Index.checkScoresRequirement(scoresGame, bestScoresDB, username);
        expect(newScore).to.be.undefined;
    });

    it('should not add scoreHuman 0, scoreCPU: 5 ', () => {
        scoresGame.pop();
        scoreHuman = 0;
        username = 'karma';
        scoreCPU = 5;
        scoresGame[0] = scoreHuman;
        scoresGame[1] = scoreCPU;
        newScore = Route.Index.checkScoresRequirement(scoresGame, bestScoresDB, username);
        expect(newScore).to.be.undefined;
    });

    it('should add (scoreHuman: 5, scoreCPU: 0) above (scoreHuman = 5, scoreCPU = 1) in bestScoresDB', () => {
        scoresGame.pop();
        scoreHuman = 5;
        username = 'karma';
        scoreCPU = 0;
        scoresGame[0] = scoreHuman;
        scoresGame[1] = scoreCPU;
        newScore = Route.Index.checkScoresRequirement(scoresGame, bestScoresDB, username);
        bestScoresDB[scoresGame[2]].id = newScore.id;
        bestScoresDB[scoresGame[2]].username = newScore.usernamePlayer;
        bestScoresDB[scoresGame[2]].scoreHuman = newScore.scoreHuman;
        bestScoresDB[scoresGame[2]].scoreCPU = newScore.scoreCPU;
        expect(scoresGame[2]).to.equal(0);
    });

    it('should add (scoreHuman: 5, scoreCPU: 0) below (scoreHuman = 5, scoreCPU = 0) in bestScoresDB', () => {
        scoresGame.pop();
        scoreHuman = 5;
        username = 'angular';
        scoreCPU = 0;
        scoresGame[0] = scoreHuman;
        scoresGame[1] = scoreCPU;
        newScore = Route.Index.checkScoresRequirement(scoresGame, bestScoresDB, username);
        bestScoresDB[scoresGame[2]].id = newScore.id;
        bestScoresDB[scoresGame[2]].username = newScore.usernamePlayer;
        bestScoresDB[scoresGame[2]].scoreHuman = newScore.scoreHuman;
        bestScoresDB[scoresGame[2]].scoreCPU = newScore.scoreCPU;
        expect(scoresGame[2]).to.equal(1);
    });
});

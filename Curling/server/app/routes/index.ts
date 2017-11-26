import * as DatabaseManagerService from '../services/database-manager.service';

import * as express from 'express';

import { ScoreDB } from '../classes/scoreDB';

module Route {

  export class Index {

    public static checkScoresRequirement(scoresGame: number[], bestScoresDB: Array<any>, username: string): ScoreDB {
      let newScore: ScoreDB;
      let find = false;
      let newIndex = 0;
      let scoreHuman = scoresGame[0];
      let scoreCPU = scoresGame[1];

      if (scoreHuman > scoreCPU) {
        for (let idx = 0; !find && idx < bestScoresDB.length; idx++) {
          let scoreHumanDB = +bestScoresDB[idx].scoreHuman;
          let scoreCPUDB = +bestScoresDB[idx].scoreCPU;

          if (scoreHuman > scoreHumanDB) {
            newScore = new ScoreDB(bestScoresDB[idx].id, username, scoreHuman, scoreCPU);
            newIndex = idx;
            find = true;
          }
          else if (scoreHuman === scoreHumanDB) {
            let idxOther = idx;

            // check if there is others
            while (++idx < bestScoresDB.length) {
              if (scoreHuman === +bestScoresDB[idx].scoreHuman) {
                idxOther = idx;
              }
            }

            // if not the last in DB array
            if (idxOther < bestScoresDB.length - 1) {
              newScore = (scoreCPU >= scoreCPUDB) ?
                new ScoreDB(bestScoresDB[idxOther].id + 1, username, scoreHuman, scoreCPU) :
                new ScoreDB(bestScoresDB[idxOther].id, username, scoreHuman, scoreCPU);
              newIndex = (scoreCPU >= scoreCPUDB) ? idxOther + 1 : idxOther;
              find = true;
            }
          }
        }
      }

      scoresGame.push(newIndex);
      return newScore;
    }

    public static updateScore(req: any, bestScoresDB: Array<any>,
      dbManager: DatabaseManagerService.DatabaseManager): Promise<boolean> {
      return new Promise<boolean>((resolve) => {
        let scoreHuman = +req.body.scoreHuman;
        let scoreCPU = +req.body.scoreCPU;
        let username = req.body.username;
        let newScore: ScoreDB;
        let scoresGame: number[] = [];

        scoresGame.push(scoreHuman);
        scoresGame.push(scoreCPU);
        newScore = Route.Index.checkScoresRequirement(scoresGame, bestScoresDB, username);

        if (newScore !== undefined) {
          let newIdx = scoresGame[2];
          Route.Index.switchScore(req.body.level, newIdx, newScore, bestScoresDB, dbManager);
          resolve(true);
        }
        else {
          resolve(false);
        }
      });
    }

    public static switchScore(level: string, idx: number, newScore: ScoreDB, bestScoresDB: Array<any>,
      dbManager: DatabaseManagerService.DatabaseManager) {

      let scoreArray: Array<ScoreDB> = [];

      let old = new ScoreDB(bestScoresDB[idx].id, bestScoresDB[idx].username,
        bestScoresDB[idx].scoreHuman, bestScoresDB[idx].scoreCPU);

      while (idx < bestScoresDB.length) {
        console.log('new: ', newScore);
        scoreArray.push(newScore);
        newScore = new ScoreDB(old.id + 1, old.usernamePlayer, old.scoreHuman, old.scoreCPU);

        if (++idx < bestScoresDB.length) {
          old = new ScoreDB(bestScoresDB[idx].id, bestScoresDB[idx].username, bestScoresDB[idx].scoreHuman,
            bestScoresDB[idx].scoreCPU);
        }
        else {
          for (let idxScoreArray = 0; idxScoreArray < scoreArray.length; idxScoreArray++) {
            dbManager.findOneAndUpdate(scoreArray[idxScoreArray], level);
          }
        }
      }
    }

    public index(req: express.Request, res: express.Response, next: express.NextFunction) {
      res.send('Hello world');
    }

    public addPlayer(req: express.Request, res: express.Response, next: express.NextFunction) {
      let dbManager = DatabaseManagerService.DatabaseManager.getInstance();
      let findPlayer = dbManager.findPlayer(req.body.username);

      // add player iif not found
      findPlayer.then(username => {
        if (username !== undefined) {
          //res.statusCode = 404;
          res.json({ reponse: true });
        }
        else {
          //res.statusCode = 200;
          res.json({ reponse: false });
          dbManager.connectPlayer(req.body.username);
        }
      });
    }

    public checkBestScore(req: express.Request, res: express.Response, next: express.NextFunction) {
      console.log('niveau', req.body.level);
      let dbManager = DatabaseManagerService.DatabaseManager.getInstance();
      let bestScoresDB: Array<any>;

      dbManager.getArrayBestScore(req.body.level).then((best) => {
        bestScoresDB = best;

        Route.Index.updateScore(req, bestScoresDB, dbManager).then((update) => {
          if (update) {
            dbManager.getArrayBestScore(req.body.level).then((newBest) => {
              bestScoresDB = newBest;
              res.json({ response: bestScoresDB });
            });
          }
          else {
            res.json({ response: bestScoresDB });
          }
        });
      });
    }
  }
}

export = Route;

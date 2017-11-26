import * as express from 'express';

import * as GridManagerService from './services/grid-manager.service';
import * as DatabaseManagerService from './services/database-manager.service';
import { ScoreBD } from './classes/scoreBD';
import { ReadWriteToFile } from './classes/readWriteToFile';

const DATE_TIME_OPTIONS = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
};

const SERVER_BOARD_TEMPLATE_URL = __dirname.substring(0, __dirname.length - 3)
  + 'app/assets/templates/leader-board.ejs';
const REQUEST_TYPE = "DEMANDE";
const enum TIME {
  SEC_START = 3,
  SEC_END = 4,
  MIN_START = 0,
  MIN_END = 2,
  DECIMAL_VALUE = 10,
}


module Route {

  export class Index {

    private event: string;
    private readWriteToFile: ReadWriteToFile;
    private gridManager: GridManagerService.GridManager;

    constructor() {
      this.initialize();
    }

    private initialize() {
      this.gridManager = GridManagerService.GridManager.getInstance();
      this.readWriteToFile = ReadWriteToFile.getInstance();
    }

    public index(req: express.Request, res: express.Response, next: express.NextFunction) {
      res.send('Hello world');
    }

    public boardServer(req: express.Request, res: express.Response, next: express.NextFunction) {
      this.gridManager = GridManagerService.GridManager.getInstance();
      this.readWriteToFile = ReadWriteToFile.getInstance();
      this.readWriteToFile.read100LastEvents().then(
        (lastEvents: Array<string>) => {
          res.render(SERVER_BOARD_TEMPLATE_URL, {
            nEvents: lastEvents.length,
            lastEvents: lastEvents,
            nNormalGrid: this.gridManager.getNnormalGrid(),
            nDifficultGrid: this.gridManager.getNdifficultGrid(),
          });
        }
      );
    }

    public sendGrid(req: express.Request, res: express.Response, next: express.NextFunction) {
      // add event to .txt file
      this.readWriteToFile = ReadWriteToFile.getInstance();
      let dateTime = new Date().toLocaleString('en-us', DATE_TIME_OPTIONS);
      this.event = dateTime + " : " + REQUEST_TYPE + " : " + req.ip;
      this.readWriteToFile.addEvent(this.event);

      this.gridManager = GridManagerService.GridManager.getInstance();

      setTimeout(() => {
        let grid = this.gridManager.getSudoku(req.query.level);
        res.send(grid);
      }, 5000);
    }

    public addPlayer(req: express.Request, res: express.Response, next: express.NextFunction) {
      let dbManager = DatabaseManagerService.DatabaseManager.getInstance();
      let findPlayer = dbManager.findPlayer(req.body.username);

      // add player if not found
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
      let dbManager = DatabaseManagerService.DatabaseManager.getInstance();
      let response;
      let bestScores: Array<any>;
      let minPlayer: number, secPlayer: number, timeDB: string, timePlayer: string;

      timePlayer = req.body.time;
      minPlayer = parseInt(timePlayer.substr(TIME.MIN_START, TIME.MIN_END), TIME.DECIMAL_VALUE);
      secPlayer = parseInt(timePlayer.substr(TIME.SEC_START, TIME.SEC_END), TIME.DECIMAL_VALUE);

      let arrayBestScore = dbManager.getArrayBestScore(req.body.level);
      arrayBestScore.then(currentScore => {
        bestScores = currentScore;
        let find = false;

        for (let idxBestScore = 0; !find && idxBestScore < bestScores.length; idxBestScore++) {
          timeDB = bestScores[idxBestScore].score;
          let minDB = parseInt(timeDB.substr(TIME.MIN_START, TIME.MIN_END), TIME.DECIMAL_VALUE);
          let secDB = parseInt(timeDB.substr(TIME.SEC_START, TIME.SEC_END), TIME.DECIMAL_VALUE);

          if (minPlayer < minDB || (minPlayer === minDB && secPlayer < secDB)) {
            find = true;
            let update;
            let scoreArray: Array<ScoreBD> = [];

            // TODO: AJOUTER LES SCORES DYNAMIQUEMENT DANS scoreArray
            if (idxBestScore === 0) {
              scoreArray.push(
                new ScoreBD(bestScores[idxBestScore].id, req.body.username, timePlayer));
              scoreArray.push(
                new ScoreBD(bestScores[idxBestScore + 1].id,
                  bestScores[idxBestScore].username, bestScores[idxBestScore].score));
              scoreArray.push(
                new ScoreBD(bestScores[idxBestScore + 2].id,
                  bestScores[idxBestScore + 1].username, bestScores[idxBestScore + 1].score));
            }
            else if (idxBestScore === 1) {
              scoreArray.push(
                new ScoreBD(bestScores[idxBestScore].id, req.body.username, timePlayer, ));
              scoreArray.push(
                new ScoreBD(bestScores[idxBestScore + 1].id,
                  bestScores[idxBestScore].username, bestScores[idxBestScore].score, ));
            }
            else {
              scoreArray.push(new ScoreBD(bestScores[idxBestScore].id, req.body.username, timePlayer, ));
            }

            for (let idxScoreArray = 0; idxScoreArray < scoreArray.length; idxScoreArray++) {
              update = dbManager.findOneAndUpdate(scoreArray[idxScoreArray], req.body.level);
            }

            update.then(isUpdate => {
              if (isUpdate) {
                arrayBestScore = dbManager.getArrayBestScore(req.body.level);
                arrayBestScore.then(currentArray => {
                  response = currentArray;
                  res.json({ response: response });
                });
              }
              else {
                response = false;
                res.json({ response: response });
              }

            });
          }
        }
      });
    }
  }
}

export = Route;

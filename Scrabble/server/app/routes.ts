import * as express from 'express';
import * as DatabaseManagerService from './services/database-manager.service';


module Route {

  export class Index {

    public index(req: express.Request, res: express.Response, next: express.NextFunction) {
      res.send('Hello world');
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
  }
}

export = Route;

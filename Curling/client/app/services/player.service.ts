import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';

import { Player } from '../classes/player';
import { PLAYERS } from '../classes/mock-players';

@Injectable()
export class PlayerService {

  private playerUrl = 'http://localhost:3002/api/players';
  private scoreUrl = 'http://localhost:3002/api/score';
  headers: Headers;

  constructor(private http: Http) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
  }

  addPlayer(userName: string): Promise<any> {
    return this.http
      .post(this.playerUrl, "username=" + userName, { headers: this.headers })
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  getPlayers(): Promise<Player[]> {
    return Promise.resolve(PLAYERS);
  }

  checkBestScore(username: string, scoreHuman: number, scoreCPU: number, level: string): Promise<any> {
    return this.http
      .post(this.scoreUrl, "username=" + username + "&" + "scoreHuman=" + scoreHuman + "&" + "scoreCPU=" + scoreCPU
      + "&" + "level=" + level, { headers: this.headers })
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }
}


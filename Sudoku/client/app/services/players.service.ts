import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';

@Injectable()
export class PlayersService {

  private playerUrl = 'http://localhost:3002/api/joueurs';
  private timerUrl = 'http://localhost:3002/api/timer';
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

  checkBestScore(username: string, time: string, level: string): Promise<any> {
    return this.http
      .post(this.timerUrl, "username=" + username + "&" + "time=" + time
      + "&" + "level=" + level, { headers: this.headers })
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

}

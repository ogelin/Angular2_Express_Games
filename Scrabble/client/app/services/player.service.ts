import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { Player } from '../classes/Player';
import { PLAYERS } from '../classes/mock-players';

@Injectable()
export class PlayerService {
    private playerUrl = 'http://localhost:3002/api/players';
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
        return Promise.reject(error.message || error);
    }

    getPlayers(): Promise<Player[]> {
        return Promise.resolve(PLAYERS);
    }
}

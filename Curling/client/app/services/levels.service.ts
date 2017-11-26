import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';

import { Level } from '../classes/level';
import { LEVEL } from '../classes/mock-levels';

@Injectable()
export class LevelsService {

    private levelUrl = 'http://localhost:3002/api/level';

    constructor(private http: Http) { }

    getLevel(): Promise<Level[]> {
        return Promise.resolve(LEVEL);
    }

    sendLevel(level: number): Promise<any> {
        let headers: Headers;
        headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http
            .post(this.levelUrl, "niveau=" + level, { headers: headers })
            .toPromise()
            .then(res => res.json());
    }

}

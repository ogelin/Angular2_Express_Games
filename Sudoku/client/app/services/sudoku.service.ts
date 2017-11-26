import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';

import { GridRow } from '../class/gridRow';

@Injectable()
export class SudokuService {
  private newGridUrl = 'http://localhost:3002/api/grid';
  private headers: Headers;

  constructor(private http: Http) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
  }


  getNewGrid(level: String): Promise<Array<GridRow>> {
    return this.http
      .get(this.newGridUrl + '?level=' + level)
      .toPromise()
      .then((response) => {
        return response.json();
      })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}

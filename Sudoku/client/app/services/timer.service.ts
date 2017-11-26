import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';

import { Timer } from '../class/timer';

@Injectable()
export class TimerService {

private timerURL = 'http://localhost:3002/api/timer';

  constructor(private http : Http) { }

  getTimer(): Promise<Timer> {
      return this.http.get(this.timerURL)
              .toPromise()
              .then(response => response.json())
              .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

}

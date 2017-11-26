import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';

export class Timer {
    minutes: number;
    seconds: number;
    totSeconds: number;
    timer: any;

    constructor() {
        this.totSeconds = 301;
    }

    startTimer(): Observable<any> {
        let observable = new Observable((observer) => {
            this.timer = setInterval(() => {
                this.decrementTimer();
                observer.next({ "minutes": this.minutes, "seconds": this.seconds });
            }, 1000);
        });
        return observable;
    }

    initializeTimer() {
        this.totSeconds = 301;
    }

    decrementTimer() {
        this.minutes = Math.floor((--this.totSeconds) / 60);
        this.seconds = this.totSeconds % 60;
        if (this.totSeconds === 0) {
            this.initializeTimer();
        }

    }

}

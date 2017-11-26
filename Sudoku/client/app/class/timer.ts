const enum TIMER{
    LIMIT = 9,
    AMOUNT_SECONDS = 60
}

export class Timer {
    minutes: number;
    min: string;
    seconds: number;
    sec: string;
    totSeconds: number;
    timer: any;

    start(){
        this.timer = setInterval(() => {
            this.minutes = Math.floor(++this.totSeconds / TIMER.AMOUNT_SECONDS);
            this.seconds = this.totSeconds % TIMER.AMOUNT_SECONDS;

            if (this.minutes <= TIMER.LIMIT){
                this.min = "0" + this.minutes;
            }
            else{
                this.min = "" + this.minutes;
            }
            if (this.seconds <= TIMER.LIMIT){
                this.sec = "0" + this.seconds;
            }
            else{
                this.sec = "" + this.seconds;
            }
        }, 1000);
    }

    stop(){
        clearInterval(this.timer);
    }
    reset(){
        this.totSeconds = this.minutes = this.seconds = -1;
    }

    constructor() {
        this.minutes = 0;
        this.min = "00";
        this.seconds = 0;
        this.sec = "00";
        this.totSeconds = 0;
    }

}

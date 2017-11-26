import { VIRTUAL_PLAYER } from './properties';

export class VirtualPlayer {
    private level: string;
    constructor() {
        //todo
    }

    private getRandomValue(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    public setLevel(level: string) {
        this.level = level.toLowerCase();
    }

    public getLaunch(type: string): number {
        let minValue: number, maxValue: number;
        if (type === 'radius') {
            if (this.level === 'normal') {
                minValue = VIRTUAL_PLAYER.NORMAL_RADIUS_MIN;
                maxValue = VIRTUAL_PLAYER.NORMAL_RADIUS_MAX;
            }
            else {
                minValue = VIRTUAL_PLAYER.DIFFICULT_RADIUS_MIN;
                maxValue = VIRTUAL_PLAYER.DIFFICULT_RADIUS_MAX;
            }
        }
        else if (type === 'speed') {
            if (this.level === 'normal') {
                minValue = VIRTUAL_PLAYER.NORMAL_SPEED_MIN;
                maxValue = VIRTUAL_PLAYER.NORMAL_SPEED_MAX;
            }
            else {
                minValue = VIRTUAL_PLAYER.DIFFICULT_SPEED_MIN;
                maxValue = VIRTUAL_PLAYER.DIFFICULT_SPEED_MAX;
            }
        }
        else {
            minValue = maxValue = 0;
        }

        return this.getRandomValue(minValue, maxValue);

    }
}

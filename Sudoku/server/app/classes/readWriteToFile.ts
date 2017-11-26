import * as fs from 'fs';
import * as ReverseLineReader from 'reverse-line-reader';

const url = './app/data/events-data.txt';
const MAX_LINE_TO_SHOW = 100;

export class ReadWriteToFile {
    private static instance: ReadWriteToFile;
    private lastEvents: Array<string>;
    private fileUrl: string;

    static getInstance(fileUrl?: string): ReadWriteToFile {
        if (ReadWriteToFile.instance === undefined) {
            ReadWriteToFile.instance = new ReadWriteToFile(fileUrl);
        }
        return ReadWriteToFile.instance;
    }

    constructor(fileUrl?: string) {
        this.lastEvents = [];
        this.fileUrl = (fileUrl === undefined) ? url : fileUrl;
    }

    addEvent(event: string): boolean {
        fs.appendFileSync(this.fileUrl, event + '\n');
        return true;
    }

    read100LastEvents(): Promise<Array<string>> {
        let temp: Array<string> = [];

        // if the file exit, read it
        if (fs.existsSync(this.fileUrl)) {
            return new Promise<Array<string>>((resolve) => {
                let nEvents = 0;
                ReverseLineReader.eachLine(this.fileUrl, (line: string, lastLine: boolean) => {
                    if (nEvents < MAX_LINE_TO_SHOW && line !== '') {
                        nEvents++;
                        temp.push(line);
                    }

                    if (lastLine) {
                        this.lastEvents = temp;
                        resolve(temp);
                    }
                }).then((somethingWrong: any) => {
                    // if the file is empty or something else happen return an empty array
                    resolve(temp);
                });
            });
        }

        // return an empty array if there is no file to read
        return new Promise<Array<string>>((resolve) => {
            resolve(temp);
        });
    }

    deleteFileFromDisk(): boolean {
        if (fs.existsSync(this.fileUrl)) {
            fs.unlinkSync(this.fileUrl);
            return true;
        }
        return false;
    }
}


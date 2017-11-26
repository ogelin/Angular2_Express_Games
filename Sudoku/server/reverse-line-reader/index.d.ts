declare module reverseLineReader{
    export function eachLine(filename: string, cb: any, separator?: string, encoding?: string, chunkSize?: number): any;
}
export = reverseLineReader;
import { assert, expect } from 'chai';

import { ReadWriteToFile } from '../classes/readWriteToFile';

const url = './app/data/test.txt';

describe('Testing ReadWriteToFile', () => {
    let readWriteToFile: ReadWriteToFile;

    beforeEach(function () {
        readWriteToFile = new ReadWriteToFile(url);
    });

    it('Should check that there is no file to read', function () {
        readWriteToFile.read100LastEvents().then(
            (lastEvents: Array<string>) => {
                assert.isTrue(lastEvents.length === 0);
            }
        );
    });

    it('Should create a .txt file in the folder data and add allo', function () {
        assert.isTrue(readWriteToFile.addEvent('allo'));
    });

    it('Should check that the file is not empty', function () {
        readWriteToFile.read100LastEvents().then(
            (lastEvents: Array<string>) => {
                assert.isTrue(lastEvents.length !== 0);
            }
        );
    });

    it('Should check that the line readed  == allo', function () {
        readWriteToFile.read100LastEvents().then(
            (lastEvents: Array<string>) => {
                expect(lastEvents[lastEvents.length - 1]).to.be.equal('allo');
            }
        );
    });

    it('Should add mocha to the file', function () {
        assert.isTrue(readWriteToFile.addEvent('mocha'));
    });

    it('Should check that the file as more than 1 line', function () {
        readWriteToFile.read100LastEvents().then(
            (lastEvents: Array<string>) => {
                assert.isTrue(lastEvents.length > 1);
            }
        );
    });

    it('Should check that the last line is mocha', function () {
        readWriteToFile.read100LastEvents().then(
            (lastEvents: Array<string>) => {
                expect(lastEvents[0]).to.be.equal('mocha');
            }
        );
    });

    it('Should check that the first line is not mocha', function () {
        readWriteToFile.read100LastEvents().then(
            (lastEvents: Array<string>) => {
                expect(lastEvents[lastEvents.length - 1]).to.not.be.equal('mocha');
            }
        );
    });

    it('Should check that the first line is allo', function () {
        readWriteToFile.read100LastEvents().then(
            (lastEvents: Array<string>) => {
                expect(lastEvents[lastEvents.length - 1]).to.be.equal('allo');
            }
        );
    });

    it('Should delete the file created, for next test', function () {
        assert.isTrue(readWriteToFile.deleteFileFromDisk());
    });

    it('Try try to delete the same file, but will fail', function () {
        assert.isFalse(readWriteToFile.deleteFileFromDisk());
    });
});

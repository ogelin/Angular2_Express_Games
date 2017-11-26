import { CameraService } from '../services/camera.service';


import { expect, assert } from 'chai';
import * as SinonChai from 'sinon-chai';
chai.use(SinonChai);


describe('CameraService', () => {
    let cameraService: CameraService;

    beforeEach(function () {
        cameraService = new CameraService();
    });

    it('Should have created two cmaeras', function () {
        expect(cameraService.getCameras().length).to.be.equal(2);
    });

    it('Should have a PerspectiveCamera in index 0', function () {
        expect(cameraService.getCameras()[0].type).to.be.equal('PerspectiveCamera');
    });

    it('Should also a OrthographicCamera in index 1', function () {
        expect(cameraService.getCameras()[1].type).to.be.equal('OrthographicCamera');
    });

    it('The camera in 0 is set in Z = 580 ', function () {
        expect(cameraService.getCameras()[0].position.z).to.be.equal(550);
    });

    it('The camera in 0 is set in Y = 120 ', function () {
        expect(cameraService.getCameras()[0].position.y).to.be.equal(120);
    });

    it('The camera in 0 is set in X = 3.5538288883916866', function () {
        expect(cameraService.getCameras()[0].position.x).to.be.equal(3.5538288883916866);
    });

    it('The position in X of camera in 1  is not 3.5538288883916866 ', function () {
        assert.isFalse(cameraService.getCameras()[1].position.x === 3.5538288883916866);
    });

    it('The camera in 1 is set in X = 0', function () {
        assert.isTrue(cameraService.getCameras()[1].position.x === 0);
    });

    it('The camera in 1 is set in Y = 150', function () {
        assert.isTrue(cameraService.getCameras()[1].position.y === 150);
    });

    it('The camera in 1 is set in Z = 0', function () {
        assert.isTrue(cameraService.getCameras()[1].position.z === 0);
    });

    it('The camera in 1 is rotated in Z', function () {
        assert.isTrue(cameraService.getCameras()[1].rotation.z !== 0);
    });

    it('The camera in 1 is rotated in Y', function () {
        assert.isTrue(cameraService.getCameras()[1].rotation.y !== 0);
    });
});

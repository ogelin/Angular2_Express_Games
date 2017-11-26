import { ObjectCreaterService } from '../services/object-creater.service';
import { LightService } from '../services/light.service';
import { Object3DManagerService } from '../services/object3D-manager.service';
import { assert } from 'chai';
import * as SinonChai from 'sinon-chai';
chai.use(SinonChai);


describe('Object3DService', () => {
    let objectCreaterService: ObjectCreaterService;
    let lightService: LightService;
    let object3DService: Object3DManagerService;

    beforeEach(function () {
        objectCreaterService = new ObjectCreaterService();
        lightService = new LightService();
        object3DService = new Object3DManagerService(objectCreaterService, lightService);
    });

    it('Should always pass', function () {
        assert.isTrue(true);
    });
});

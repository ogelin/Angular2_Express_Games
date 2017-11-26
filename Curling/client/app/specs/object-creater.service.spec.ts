import { ObjectCreaterService } from '../services/object-creater.service';
import { assert, expect } from 'chai';
import {
    STONE_COLLISION_URL, BLUE_STONE_URL, RED_STONE_URL, BROOM_URL, SPIN_ANTI_CLOCKWISE
} from '../classes/properties';

describe('ObjectCreaterService', function () {
    let objectCreaterService: ObjectCreaterService;

    beforeEach(() => {
        chai.config.includeStack = true;
    });

    beforeEach(() => {
        objectCreaterService = new ObjectCreaterService();
    });


    it('should return a valid Object3D', done => {
        objectCreaterService.createTeapot()
            .then(obj => {
                expect(obj).to.not.be.undefined.and.to.be.a('Object3D');
            })
            .catch(x => {
                assert.fail(x);
            })
            .then(x => {
                done();
            });
    });

    it('should return the first teapot with a number 0', done => {
        objectCreaterService.createTeapot()
            .then(obj => {
                const regex = new RegExp(/^[a-zA-z]*(\d+)$/, "gi");
                if (obj.name.search(regex) === -1) {
                    done('Regex failed to obtain a match');
                }
                // Calling several time regex.exec(str) will advance
                // the match group : we lose our match in this case.
                // This is the perfect example of what is wrong with
                // some JavaScript methods.
                let match = regex.exec(obj.name);
                let i = parseInt(match[1], 10);
                expect(i).to.be.a('number').and.to.equal(0);
            })
            .catch(x => {
                done(x);
            })
            .then(x => {
                done();
            });
    });

    it('should return a teapot with a scale of 1', done => {
        objectCreaterService.createTeapot()
            .then(obj => {
                let expectedVector = new THREE.Vector3(1, 1, 1);
                expect(obj.scale.clone()).to.deep.equal(expectedVector);
                done();
            })
            .catch(x => {
                done(x);
            });
    });

    it('should return a teapot with all user attributes', done => {
        objectCreaterService.createTeapot()
            .then(obj => {
                let nVec = new THREE.Vector3(0, 0, 0);
                expect(obj.userData).to.have.property('vie');
                expect(obj.userData.vie as THREE.Vector3).to.deep.equal(nVec);

                done();
            })
            .catch(x => {
                done(x);
            });
    });


    describe('loadObject3D', function () {
        it('Should load a stone', function () {
            objectCreaterService.loadObject3D(RED_STONE_URL).then(stone => {
                expect(stone).to.not.be.undefined.and.to.be.a('Object3D');
            }).catch(error => {
                assert.fail(error);
            });
        });

        it('The stone name is red_stone', function () {
            objectCreaterService.loadObject3D(RED_STONE_URL).then(stone => {
                expect(stone.name).to.be.equal('red_stone');
            }).catch(error => {
                assert.fail(error);
            });
        });

        it('Should load an other Object3D', function () {
            objectCreaterService.loadObject3D(BLUE_STONE_URL).then(stone => {
                expect(stone).to.not.be.undefined.and.to.be.a('Object3D');
            }).catch(error => {
                assert.fail(error);
            });
        });

        it('The stone name is blue_stone', function () {
            objectCreaterService.loadObject3D(BLUE_STONE_URL).then(stone => {
                expect(stone.name).to.be.equal('blue_stone');
            }).catch(error => {
                assert.fail(error);
            });
        });

        it('Should catch an error when trying to load an Object3D', function () {
            objectCreaterService.loadObject3D('allo.json').then(stone => {
                expect(stone).to.not.be.undefined.and.to.be.a('Object3D');
            }).catch(error => {
                assert.fail(error);
            });
        });
    });

    describe('loadSound', function () {
        it('Should load a sound', function () {
            objectCreaterService.loadSound(STONE_COLLISION_URL).then((sound) => {
                expect(sound).to.not.be.undefined.and.to.be.a('Audio');
            });
        });
    });

    describe('loadCollada', function () {
        it('Should load collada object', function () {
            objectCreaterService.loadCollada(BROOM_URL).then((obj) => {
                expect(obj).to.not.be.undefined.and.to.be.a('ColladaModel');
            });
        });
    });

    describe('loadSprite', function () {
        it('Should load Sprite object', function () {
            objectCreaterService.loadCollada(SPIN_ANTI_CLOCKWISE).then((obj) => {
                expect(obj).to.not.be.undefined.and.to.be.a('Sprite');
            });
        });
    });
});

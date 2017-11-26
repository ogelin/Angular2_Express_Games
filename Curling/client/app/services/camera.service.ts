import { Injectable } from '@angular/core';
import { CAMERA } from '../classes/properties';

@Injectable()
export class CameraService {
    private cameras: any[];
    private activeCamera: any;

    constructor() {
        this.cameras = new Array<any>();
        this.initFrontCamera();
        this.initTopCamera();
        this.activeCamera = this.getFrontCamera();
    }

    private initFrontCamera() {
        let frontCamera = new THREE.PerspectiveCamera(CAMERA.FOV, window.innerWidth / window.innerHeight,
            CAMERA.NEAR, CAMERA.FAR);
        frontCamera.position.set(CAMERA.PERSPEC_X, CAMERA.PERSPEC_Y, CAMERA.PERSPEC_Z);
        this.cameras.push(frontCamera);
    }

    public getCameras(): any[] {
        return this.cameras;
    }

    public getActiveCamera(): any {
        return this.activeCamera;
    }

    private initTopCamera() {
        let topCamera = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2,
            window.innerHeight / 2, window.innerHeight / - 2, CAMERA.NEAR, CAMERA.FAR);
        topCamera.rotateZ(CAMERA.ROT_ANGLE_Z);
        topCamera.rotateY(CAMERA.ROT_ANGLE_Y);
        topCamera.position.y = CAMERA.ORTHO_Y;
        this.cameras.push(topCamera);
    }

    public putPerspectiveCameraToScene(scene: THREE.Scene) {
        this.activeCamera.lookAt(scene.position);
    }

    public changeView() {
        this.activeCamera = (this.activeCamera instanceof THREE.PerspectiveCamera) ?
            this.getTopCamera() : this.getFrontCamera();
    }

    public backToFrontCamera() {
        this.activeCamera = this.getFrontCamera();
    }

    public getFrontCamera(): THREE.PerspectiveCamera {
        return this.cameras[CAMERA.FRONT];
    }

    public getTopCamera(): THREE.OrthographicCamera {
        return this.cameras[CAMERA.TOP];
    }

    public followStone(activeCamera: any, stone: THREE.Object3D) {
        if (activeCamera instanceof THREE.PerspectiveCamera) {
            activeCamera.position.z = stone.position.z + 200;
        }
    }

    public setPositionEnd(activeCamera: any) {
        activeCamera.position.z = CAMERA.POS_END;
    }

    public translateCamera(activeCamera: any, position: THREE.Vector3): void {
        activeCamera.position.x += position.x === undefined ? 0 : position.x;
        activeCamera.position.y += position.y === undefined ? 0 : position.y;
        activeCamera.position.z += position.z === undefined ? 0 : position.z;
        activeCamera.updateProjectionMatrix();
    }

    public backToDefaultPosition(activeCamera: any) {
        activeCamera.position.set(CAMERA.PERSPEC_X, CAMERA.PERSPEC_Y, CAMERA.PERSPEC_Z);
    }
}

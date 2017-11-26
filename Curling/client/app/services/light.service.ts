import { Injectable } from '@angular/core';

@Injectable()
export class LightService {

    private spotLight: THREE.SpotLight;
    private dirLight: THREE.DirectionalLight;
    private ambientLight: THREE.AmbientLight;

    constructor() {
        this.init();
    }

    private init(): void {
        this.spotLight = this.createSpotlight(0xffffff); //white 100%
        this.dirLight = this.createDirLight(0xd9d9d9); // white 85%
        this.ambientLight = this.createAmbientLight(0x262626); //white 15%
    }

    public createSpotlight(color: number): THREE.SpotLight {
        let spotLight = new THREE.SpotLight(color);
        spotLight.intensity = 0.3;
        spotLight.angle = 0.3;
        spotLight.distance = 0;
        return spotLight;
    }

    public createDirLight(color: number): THREE.DirectionalLight {
        let dirLight = new THREE.DirectionalLight(color, 1.0);
        return dirLight;
    }

    public createAmbientLight(color: number): THREE.AmbientLight {
        let ambient = new THREE.AmbientLight(color);
        return ambient;
    }

    putLightToScene(scene: THREE.Scene, position: THREE.Vector3) {
        let ambient = this.ambientLight;
        let dirLight1 = this.dirLight;
        let dirLight2 = this.dirLight;
        dirLight1.position.set(position.x, position.y, position.z);
        dirLight2.position.set(-position.x, position.y, -position.z);
        scene.add(ambient);
        scene.add(dirLight1);
        scene.add(dirLight2);
    }

    putSpotLighOnStone(scene: THREE.Scene, stone: THREE.Object3D) {
        this.spotLight.position.set(stone.position.x, stone.position.y, stone.position.z);
        this.spotLight.position.y = 50;
        this.spotLight.target = stone;
        scene.add(this.spotLight);
    }

    removeSpotLightOnStone(scene: THREE.Scene) {
        scene.remove(this.spotLight);
    }
}

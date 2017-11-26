export class ObjectProperties {
    position: THREE.Vector3;
    rotation: THREE.Euler;
    scale: THREE.Vector3;

    constructor(position: THREE.Vector3, scale?: THREE.Vector3, rotation?: THREE.Euler) {
        this.position = new THREE.Vector3(position.x, position.y, position.z);
        this.scale = new THREE.Vector3(scale.x, scale.y, scale.z);
        this.rotation = new THREE.Euler(rotation.x, rotation.y, rotation.z);
    }
}

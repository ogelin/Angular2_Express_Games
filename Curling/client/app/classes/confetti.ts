const enum CONFETTI {
    POS_X_MAX = 65,
    POS_X_MIN = -65,
    POS_Y = 180,
    POS_Z_MIN = -400,
    POS_Z_MAX = -180,
    WIDTH = 10,
    LENGTH = 3,
}

export class Confetti {
    private confettis: THREE.Mesh[] = [];
    private geometry: THREE.PlaneBufferGeometry;
    private material: THREE.MeshBasicMaterial;
    private confetti: THREE.Mesh;
    private scene: THREE.Scene;

    constructor() {
        //todo
    }

    initScene(scene: THREE.Scene) {
        this.scene = scene;
    }

    initConfetti(stoneInRink: THREE.Object3D[]) {
        let positionX = THREE.Math.randInt(CONFETTI.POS_X_MIN, CONFETTI.POS_X_MAX);
        let positionY = CONFETTI.POS_Y;
        let positionZ = THREE.Math.randInt(CONFETTI.POS_Z_MIN, CONFETTI.POS_Z_MAX);
        let randomColor = '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6);


        this.geometry = new THREE.PlaneBufferGeometry(CONFETTI.WIDTH, CONFETTI.LENGTH);
        this.material = new THREE.MeshBasicMaterial({ color: randomColor, side: THREE.DoubleSide, transparent: true });
        this.confetti = new THREE.Mesh(this.geometry, this.material);
        this.confetti.position.x = positionX;
        this.confetti.position.y = positionY;
        this.confetti.position.z = positionZ;

        this.moveConfetti(stoneInRink);
    }

    moveConfetti(stoneInRink: THREE.Object3D[]) {
        this.confettis.push(this.confetti);
        this.scene.add(this.confetti);

        this.collisionWithStone(stoneInRink);
        this.goingDown(this.confetti);
        this.rotate(this.confetti);
    }

    private goingDown(confetti: THREE.Mesh) {
        for (let i = 0; i < 5000; i += 100) {
            setTimeout(() => {
                if (confetti.position.y >= this.scene.position.y) {
                    confetti.translateY(-5);
                }
                else {
                    confetti.translateY(0);
                }
            }, (i));
        }
    }

    private rotate(confetti: THREE.Mesh) {
        let turn = true;
        for (let i = 0; i < 5000; i += 100) {
            setTimeout(() => {
                if (confetti.position.y <= this.scene.position.y) {
                    if (turn) {
                        confetti.rotateX(Math.PI / 2);
                        turn = false;
                    }
                    else {
                        confetti.rotateY(0);
                    }
                }
                else {
                    confetti.rotateY(5);
                }
            }, (i));
        }
    }


    manyConfettis(stoneInRink: THREE.Object3D[]) {
        for (let i = 0; i < 3000; i += 50) {
            setTimeout(() => {
                this.initConfetti(stoneInRink);
            }, (i));
        }
    }

    clearConfetti() {
        for (let confetti of this.confettis) {
            this.scene.remove(confetti);
        }
        while (this.confettis.length !== 0) {
            this.confettis.pop();
        }
    }

    collisionWithStone(stoneInRink: THREE.Object3D[]) {
        for (let stone of stoneInRink) {
            if (stone.position.x === this.confetti.position.x && stone.position.z === this.confetti.position.z
                && stone.position.y === this.confetti.position.y) {
                this.confetti.translateY(0);
                this.confetti.rotateX(Math.PI / 2);
                return true;
            }
        }
        return false;
    }
}

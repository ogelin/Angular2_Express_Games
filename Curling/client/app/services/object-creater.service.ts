import { Injectable } from '@angular/core';
import { ObjectProperties } from '../classes/Object-properties';

@Injectable()
export class ObjectCreaterService {
    private objectLoader: THREE.ObjectLoader;
    private textLoader = new THREE.TextureLoader();
    private audioLoader: THREE.AudioLoader;
    private c = 0;
    private colladaLoader: THREE.ColladaLoader;

    constructor() {
        this.init();
    }

    private init(): void {
        this.objectLoader = new THREE.ObjectLoader();
        this.audioLoader = new THREE.AudioLoader();
        this.colladaLoader = new THREE.ColladaLoader();
    }

    private addAttributes(object: THREE.Object3D): void {
        object.name = object.name.replace(/[0-9]/g, '');
        object.name += (this.c++).toString();
        object.userData.vie = new THREE.Vector3(0, 0, 0);

    }

    private initAttributes(object: THREE.Object3D): void {
        object.scale.set(1, 1, 1);
    }


    /**
     * createTeapot
     */
    public createTeapot(): Promise<THREE.Object3D> {
        return new Promise<THREE.Mesh>((resolve, error) => {
            this.objectLoader.load('/assets/models/json/teapot-claraio.json', obj => {
                if (obj === undefined) {
                    error("Unable to load teapot");
                } else {
                    this.addAttributes(obj);
                    this.initAttributes(obj);
                    resolve(obj as THREE.Mesh);
                }
            });
        });
    }

    public loadSound(url: string): Promise<THREE.Audio> {
        let listener = new THREE.AudioListener();
        let sound = new THREE.Audio(listener);
        return new Promise<THREE.Audio>((resolve, error) => {
            this.audioLoader.load(url, (audioBuffer: THREE.AudioBuffer) => {
                // Function when resource is loaded
                // set the audio object buffer to the loaded object
                sound.name = url.substring(16, url.indexOf('.'));
                sound.setBuffer(audioBuffer);
                resolve(sound as THREE.Audio);
            }, (xhr: any) => {
                // Function called when download progresses
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            }, (xhr: any) => {
                // Function called when download errors
                console.log('An error happened');
            });

        });
    }

    public loadObject3D(url: string): Promise<THREE.Object3D> {
        return new Promise<THREE.Object3D>((resolve, error) => {
            this.objectLoader.load(url, obj => {
                if (obj === undefined) {
                    error("Unable to load Object3D");
                }
                else {
                    obj.name = url.substring(20, url.indexOf('.'));
                    resolve(obj as THREE.Object3D);
                }
            });
        });
    }

    public loadCollada(url: string): Promise<THREE.ColladaModel> {
        return new Promise<THREE.ColladaModel>((resolve, error) => {
            this.colladaLoader.load(url, obj => {
                if (obj === undefined) {
                    error("Unable to load ColladaModel");
                }
                else {
                    resolve(obj as THREE.ColladaModel);
                }
            });
        });
    }

    loadSprite(url: string): Promise<THREE.Sprite> {
        return new Promise<THREE.Sprite>((resolve, error) => {
            this.textLoader.load(url, (texture: THREE.Texture) => {
                if (texture === undefined) {
                    error("Unable to load Sprite");
                }
                else {
                    let spriteMaterial = new THREE.SpriteMaterial({ map: texture });
                    let sprite = new THREE.Sprite(spriteMaterial);

                    sprite.name = url.substring(15, url.indexOf('.'));

                    resolve(sprite as THREE.Sprite);
                }
            });
        });
    }


    public setObjectProperties(obj: THREE.Object3D, objProperties: ObjectProperties) {
        obj.position.set(objProperties.position.x, objProperties.position.y, objProperties.position.z);
        obj.scale.set(objProperties.scale.x, objProperties.scale.y, objProperties.scale.z);
        obj.rotation.set(objProperties.rotation.x, objProperties.rotation.y, objProperties.rotation.z);
    }
}

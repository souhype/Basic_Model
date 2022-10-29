import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import { FBXLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';
// import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';

addEventListener('DOMContentLoaded', () => new Model());

class Model {
    constructor() {
        this.init();
    }

    init() {
        this.scene = new THREE.Scene();

        const cameraSettings = {
            fov: 60,
            aspectRatio: innerWidth / innerHeight,
            near: 0.1,
            far: 1000,
        };
        this.camera = new THREE.PerspectiveCamera(
            cameraSettings.fov,
            cameraSettings.aspectRatio,
            cameraSettings.near,
            cameraSettings.far
        );
        this.camera.position.set(0, 10, 25);

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            canvas: document.querySelector('canvas'),
        });
        this.renderer.setSize(innerWidth * 0.95, innerHeight * 0.95);

        const directLight = new THREE.DirectionalLight();
        const ambLight = new THREE.AmbientLight();
        this.scene.add(directLight, ambLight);

        this.loader();
        this.animate();
    }

    loader() {
        const fbxLoader = new FBXLoader();
        fbxLoader.load('./assets/T_Pose_Bot.fbx', (object) => {
            object.scale.setScalar(0.1);
            // object.position.x = 0;
            // object.quaternion['_x'] = 0;
            this.scene.add(object);
        });
    }

    animate = () => {
        requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera);
    };
}

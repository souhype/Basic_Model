import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.127.0/build/three.module.js';
import { FBXLoader } from 'https://cdn.jsdelivr.net/npm/three@0.127.0/examples/jsm/loaders/FBXLoader.js';
// import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.127.0/examples/jsm/controls/OrbitControls.js';

addEventListener('DOMContentLoaded', () => new Model());

class Model {
    constructor() {
        this.init();
    }

    init() {
        this.scene = new THREE.Scene();

        this.aspectRatio = innerWidth / innerHeight;
        this.camera = new THREE.PerspectiveCamera(45, this.aspectRatio, 1, 1000);
        this.camera.position.set(0, 125, 350);
        this.camera.lookAt(0, 100, 0);

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            canvas: document.querySelector('canvas'),
        });
        this.renderer.setSize(innerWidth, innerHeight * 0.95);
        this.renderer.setPixelRatio(devicePixelRatio);
        this.renderer.shadowMap.enabled = true;

        this.clock = new THREE.Clock();

        this.enviroment();
        this.loader();
        this.animate();
    }

    enviroment() {
        const hemiLight = new THREE.HemisphereLight();
        const directLight = new THREE.DirectionalLight();
        directLight.position.set(-150, 400, 200);
        directLight.castShadow = true;
        directLight.shadow.camera.top = 200;
        directLight.shadow.camera.bottom = -200;
        directLight.shadow.camera.left = -200;
        directLight.shadow.camera.right = 200;

        const wall = new THREE.Mesh(
            new THREE.PlaneGeometry(900, 900),
            new THREE.MeshPhongMaterial({ color: 'white', depthWrite: false })
        );
        wall.receiveShadow = true;

        const ground = new THREE.Mesh(
            new THREE.PlaneGeometry(900, 900),
            new THREE.MeshPhongMaterial({ color: '#808080', depthWrite: false })
        );
        ground.rotation.x = -Math.PI * 0.5;
        ground.receiveShadow = true;

        const groundGrid = new THREE.GridHelper(1500, 20, 'black', 'black');
        groundGrid.material.opacity = 0.2;
        groundGrid.material.transparent = true;

        const wallGrid = new THREE.GridHelper(700, 20, 'black', 'black');
        wallGrid.material.opacity = 0.2;
        wallGrid.material.transparent = true;
        wallGrid.rotation.x = -Math.PI * 0.5;
        wallGrid.position.set(0, 430, -10);

        this.scene.add(hemiLight, directLight, ground, wall, groundGrid, wallGrid);
    }

    loader() {
        const fbxLoader = new FBXLoader();
        fbxLoader.load('./assets/Running.fbx', (object) => {
            object.quaternion['_y'] = 0.7;
            object.position['x'] = -150;
            this.mixer = new THREE.AnimationMixer(object);
            const run = this.mixer.clipAction(object.animations[0]);
            run.play();

            object.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            this.scene.add(object);
        });
    }

    animate = () => {
        requestAnimationFrame(this.animate);
        const delta = this.clock.getDelta();
        if (this.mixer) this.mixer.update(delta);
        this.renderer.render(this.scene, this.camera);
    };
}

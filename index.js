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
        // this.scene.background = new THREE.Color('#1a1a1a');

        this.camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 1, 1000);
        this.camera.position.set(0, 100, 350);
        // this.camera.lookAt(0, 10, 0);

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            canvas: document.querySelector('canvas'),
        });
        this.renderer.setSize(innerWidth * 0.95, innerHeight * 0.95);
        // this.renderer.shadowMap.enabled = true;

        const hemiLight = new THREE.HemisphereLight();
        const directLight = new THREE.DirectionalLight();
        // directLight.castShadow = true;
        // directLight.shadow.camera.top = 200;
        // directLight.shadow.camera.bottom = -100;
        // directLight.shadow.camera.left = -120;
        // directLight.shadow.camera.right = 120;

        const wall = new THREE.Mesh(
            new THREE.PlaneGeometry(900, 900),
            new THREE.MeshPhongMaterial({ color: 'white', depthWrite: false })
        );

        const ground = new THREE.Mesh(
            new THREE.PlaneGeometry(900, 900),
            new THREE.MeshPhongMaterial({ color: '#808080', depthWrite: false })
        );
        ground.rotation.x = -Math.PI * 0.5;
        // ground.receiveShadow = true;

        const groundGrid = new THREE.GridHelper(1500, 20, 'black', 'black');
        groundGrid.material.opacity = 0.1;
        groundGrid.material.transparent = true;

        const wallGrid = new THREE.GridHelper(700, 20, 'black', 'black');
        wallGrid.material.opacity = 0.1;
        wallGrid.material.transparent = true;
        wallGrid.rotation.x = -Math.PI * 0.5;
        wallGrid.position.set(0, 414, -10);

        this.scene.add(groundGrid, wallGrid, hemiLight, directLight, ground, wall);

        this.animate();
        this.loader();
    }

    loader() {
        const fbxLoader = new FBXLoader();
        fbxLoader.load('./assets/T_Pose_Bot.fbx', (object) => {
            // object.scale.setScalar(0.1);
            this.scene.add(object);
        });
    }

    animate = () => {
        requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera);
    };
}

import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { AsciiEffect } from 'three/addons/effects/AsciiEffect.js';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';

// Scene setup
let camera, controls, scene, renderer, effect;

let lightbulb, plane;

const start = Date.now();

init();

function init() {
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 2;

    scene = new THREE.Scene();
    scene.background = new THREE.Color('white');

    
    const pointLight1 = new THREE.PointLight(0xffffff, 3, 0, 0);
    pointLight1.position.set(500, 500, 500);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xffffff, 1, 0, 0);
    pointLight2.position.set(- 500, - 500, - 500);
    scene.add(pointLight2);
    
    const objLoader = new OBJLoader();

    objLoader.load(
        // resource URL
        'models/lightbulb-2.obj',
        
        // called when resource is loaded
        function (object) {
            lightbulb = object;
            
            scene.add(lightbulb);
        },
        // called when loading is in progresses
        function (xhr) {
            
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            
        },
        // called when loading has errors
        function (error) {
            
            console.log('An error happened');
            
        }
    );
    

    plane = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.MeshBasicMaterial({ color: 0xe0e0e0 }));
    plane.position.y = - 50;
    plane.rotation.x = - Math.PI / 2;
    scene.add(plane);
    
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(animate);

    document.body.appendChild(renderer.domElement);
    
    effect = new AsciiEffect(renderer, ' .:-+*=%@#', { invert: true });
    effect.setSize(window.innerWidth, window.innerHeight);
    effect.domElement.style.color = 'white';
    effect.domElement.style.backgroundColor = 'black';

    // // Special case: append effect.domElement, instead of renderer.domElement.
    // // AsciiEffect creates a custom domElement (a div container) where the ASCII elements are placed.

    document.body.appendChild(effect.domElement);

    controls = new TrackballControls(camera, effect.domElement);

    // //
    window.addEventListener('resize', onWindowResize);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
    effect.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

    const timer = Date.now() - start;

    // lightbulb.position.y = Math.abs(Math.sin(timer * 0.002)) * 150;
    // lightbulb.rotation.x = timer * 0.0003;
    // lightbulb.rotation.z = timer * 0.0002;

    controls.update();

    effect.render(scene, camera);

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();
import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui';
import BeginVertex from './shaders/begin_vertex.glsl';
import Common from './shaders/common.glsl';
import BeginNormal from './shaders/beginnormal_vertex.glsl';


// Debug
const gui = new dat.GUI();
const debugObject = {};

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene();

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Loaders
 const textureLoader = new THREE.TextureLoader();

 // Textures
// const mapTexture = textureLoader.load('/models/LeePerrySmith/color.jpg')
// mapTexture.encoding = THREE.sRGBEncoding
// const normalTexture = textureLoader.load('/models/LeePerrySmith/normal.jpg');

//Materials
const customUniforms = {
    uTime: { value: 0 }
}

// const material = new THREE.MeshStandardMaterial( {
//     map: mapTexture,
//     normalMap: normalTexture
// });

// material.onBeforeCompile = ( shader ) => 
// {
//     shader.vertexShader = shader.vertexShader.replace('#include <common>', Common);    
//     shader.uniforms.uTime = customUniforms.uTime;
//     shader.vertexShader = shader.vertexShader.replace('#include <beginnormal_vertex>', BeginNormal);
//     shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', BeginVertex); 
//     console.log(shader);
// }

// Sphere
const sphere = new THREE.Mesh( new THREE.SphereGeometry(1, 32, 32),  new THREE.MeshStandardMaterial( { color: 0xffff00, wireframe:true } ) );
scene.add(sphere);

//Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, 3)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0, 0)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Animate
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick();

// Events
window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    customUniforms.uTime.value = elapsedTime;

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
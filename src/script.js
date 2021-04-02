import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui';
import ProjectVertex from './shaders/project_vertex.glsl';
import Common from './shaders/common.glsl';

// Debug
const gui = new dat.GUI();
const debugObject = {
    sphere: {
        color: 0x69ff
    }
};

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
const normalTexture = textureLoader.load('/textures/normal.jpg');

//Materials
const customUniforms = {
    uTime: { value: 0 }
}

const material = new THREE.MeshStandardMaterial(
    { 
        color: new THREE.Color(debugObject.sphere.color),
        roughness: 0.7,
        metalness: 0.2,
        normalMap: normalTexture
    }
);

material.onBeforeCompile = ( shader ) => 
{
    shader.vertexShader = shader.vertexShader.replace('#include <common>', Common);    
    shader.uniforms.uTime = customUniforms.uTime;
    // shader.vertexShader = shader.vertexShader.replace('#include <project_vertex>', ProjectVertex); 
    console.log(shader);
}

// Sphere
const geometry = new THREE.SphereBufferGeometry(0.5, 64, 64);
const sphere = new THREE.Mesh( geometry,  material );
scene.add(sphere);

//Lights
const pointLight = new THREE.PointLight(0xffffff, 2)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)


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

    // customUniforms.uTime.value = elapsedTime;

    sphere.rotation.x = elapsedTime * 0.1;

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

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

gui.add(sphere.material, 'roughness').name('Roughness').min(0).max(1).step(0.01);
gui.add(sphere.material, 'metalness').name('Metalness').min(0).max(1).step(0.01);
gui.addColor(debugObject.sphere, 'color').onChange((e)=>{
    sphere.material.color.set(debugObject.sphere.color);
});
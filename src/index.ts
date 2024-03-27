import {
  AmbientLight,
  Color,
  DirectionalLight,
  Mesh,
  PerspectiveCamera,
  RawShaderMaterial,
  Scene,
  WebGLRenderer,
  SphereGeometry,
  PolyhedronGeometry,
  Clock,
  MeshStandardMaterial,
  CubeTextureLoader,
  TextureLoader,
  RepeatWrapping,
  Vector3
} from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import Stats from "stats.js";

import vertSrc from "./shaders/simple.vert.glsl";
import fragSrc from "./shaders/simple.frag.glsl";
import { PlainView } from "@tweakpane/core";

import GUI from 'lil-gui'; 

const gui = new GUI();
const container = document.getElementById("el");
let camera, scene, renderer, stats;
var cameraDirection = new Vector3(); 
let loader;
//const hdr_image = new URL('hdr/metro_noord_2k.hdr', import.meta.url)

let clock;
const lights = [];
let meshMaterial, cubeTexture, polyhedron, polyhedronGeometry;
let backgroundColor = new Color();
let envIsActive = true;

document.addEventListener('mousemove', (e) => {
  onDocumentMouseMove(e);
})

let mouseX, targetX
const windowHalfX = window.innerWidth / 2
const windowHalfY = window.innerHeight / 2

let onDocumentMouseMove = (event) => {
  mouseX = (event.clientX - windowHalfX)
}



let init = () => {
  console.debug("Init Demo!");

  //TASK 1
  scene = new Scene();
  camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
  camera.getWorldDirection(cameraDirection)
  renderer = new WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  const controls = new OrbitControls(camera, renderer.domElement);
  
  controls.addEventListener('change', () =>{
    camera.getWorldDirection( cameraDirection );
  }); // use if there is no animation loop
  
  controls.rotateSpeed = 0.5;
  controls.minZoom = 1;
  controls.target.set(0, 0, 0);
  controls.update();

  //TASK 2
  const BGcolor = new Color("rgb(40, 40, 40)");
  scene.background = BGcolor;

  /*let sphere_geometry = new SphereGeometry( 15, 32, 16 ); 
  let sphere_material = new MeshPhongMaterial( { color: 0xffffff, side: DoubleSide, flatShading: true } );
  let sphere = new Mesh(sphere_geometry, sphere_material);
  scene.add(sphere);*/

  camera.position.z = 30;

  //TASK 3
  
  const loader2 = new CubeTextureLoader();
  
  const path = './assets/cubeMaps/';

	const format = '.png';
	const urls = [
					path + 'px' + format, path + 'nx' + format,
					path + 'py' + format, path + 'ny' + format,
					path + 'pz' + format, path + 'nz' + format
				];

  cubeTexture = loader2.load( urls );
  scene.background = cubeTexture;
  //lightProbe.copy( LightProbeGenerator.fromCubeTexture(cubeTexture) );

 
  //TASK 4
  polyhedronGeometry = CreatePolyhedron(1);
  meshMaterial = new MeshStandardMaterial( 
    { color: 0xffffff, 
      metalness: 0,
      roughness: 0,
      envMap: cubeTexture,
      envMapIntensity: 1,
    });
  
  meshMaterial.needsUpdate = true;
  polyhedron = new Mesh(polyhedronGeometry, meshMaterial); 
  scene.add(polyhedron);

  //LIGHTS
  lights[ 0 ] = new DirectionalLight( 0xffffff, 3 );
	lights[ 1 ] = new DirectionalLight( 0xffffff, 3 );
	lights[ 2 ] = new DirectionalLight( 0xffffff, 3 );

	lights[ 0 ].position.set( 0, 200, 0 );
	lights[ 1 ].position.set( 100, 200, 100 );
	lights[ 2 ].position.set( - 100, - 200, - 100 );

  lights[ 0 ].shadow = true
  lights[ 1 ].shadow = true
  lights[ 2 ].shadow = true


	scene.add( lights[ 0 ] );
	scene.add( lights[ 1 ] );
	scene.add( lights[ 2 ] );

  //TASK 6
  UI();
  

  //Delete comments below for task 7
  //TASK 7
  /*const material = new RawShaderMaterial( {
      uniforms: {
        time: { value: 1.0 },
        center: { value: new Vector3(0, 0, 0) }, 
        radius: { value: 6 },
        cameraDirection: {value : cameraDirection}
      },
      vertexShader: vertSrc,
      fragmentShader: fragSrc
  } );

  polyhedron = new Mesh(polyhedronGeometry, material); 
  scene.add(polyhedron);*/

  document.body.appendChild(renderer.domElement) //add renderer to HTML
}



function CreatePolyhedron(detail): PolyhedronGeometry {
  const vertexPositions = [
    -1,-1,-1,    1,-1,-1,    1, 1,-1,    -1, 1,-1,
    -1,-1, 1,    1,-1, 1,    1, 1, 1,    -1, 1, 1,
];

const indices = [
    2,1,0,    0,3,2,
    0,4,7,    7,3,0,
    0,1,5,    5,4,0,
    1,2,6,    6,5,1,
    2,3,7,    7,6,2,
    4,5,6,    6,7,4
];
  
  const radius = 6;
  let polyGeometry = new PolyhedronGeometry(vertexPositions, indices, radius, detail);
  polyGeometry.computeVertexNormals ()
  return polyGeometry;
}


let UI = () =>{
  const PARAMS = {
    "Light Color": lights[ 0 ].color.getHex(),
    "Background Color": backgroundColor,
    "Material Color":  meshMaterial.color.getHex(),
    "Environment Map": true,
    "Subdivision": 0,
    "Texture" : "None"
  };

  const colorFolder = gui.addFolder("Colors")
  colorFolder.addColor( PARAMS, 'Light Color' ).onChange( function ( val ) {
    lights.forEach(element => {
      element.color.setHex(val);
      console.log(val)
    });
  } );

  colorFolder.addColor( PARAMS, 'Background Color' ).onChange( function ( val ) {
    backgroundColor = new Color(val);
    if(envIsActive == false){
      scene.background = new Color(val);
    }
  } );

  colorFolder.addColor( PARAMS, 'Material Color' ).onChange( function ( val ) {
    meshMaterial.color.setHex(val)
  } );

  gui.add(PARAMS, "Environment Map").onChange(function ( val ) {
    if(val == false){
      meshMaterial.envMapIntensity = 0;
      scene.background = backgroundColor;
      envIsActive = false; 
    }
    else
    {
      meshMaterial.envMapIntensity = 1;
      scene.background = cubeTexture;
      envIsActive = true;
    }
    
  })

  gui.add( PARAMS, "Subdivision", 1, 30, 1).onChange(function ( val ) {
    polyhedron.geometry = CreatePolyhedron(val)
  });

  gui.add(PARAMS, "Texture", ["None", "Gold", "Wood", "Plastic"]).onChange(function(val){
    if(val != "None"){
      const texture = new TextureLoader().load("./assets/textures/" + val + "Color.png" ); 
      const roughness = new TextureLoader().load("./assets/textures/" + val + "R.png" ); 
      let metal = 0;
      if(val == "Gold"){
        metal = 1
      }
      
      roughness.wrapS = texture.wrapT = RepeatWrapping;
      roughness.repeat.set(1,1);
      texture.flipY = false;
      texture.wrapS = texture.wrapT = RepeatWrapping;
      texture.repeat.set(1,1);

      meshMaterial.map = texture;
      meshMaterial.roughness = roughness;
      meshMaterial.metalness = metal;
      meshMaterial.needsUpdate = true;
    }
  })

  gui.open();
 
}

function rotate(speed) {
  //TASK 5
  clock = new Clock();
  targetX = mouseX * .001

  const elapsedTime = clock.getElapsedTime()

  polyhedron.rotation.y = 100 * elapsedTime
  polyhedron.rotation.y += speed * (targetX - polyhedron.rotation.y)
}

let animate = () => {
  console.debug("This is animate callback!");
  rotate(2);
  requestAnimationFrame(animate);
  render();
};

let render = () => {
  console.debug("This is a debug callback")
  renderer.render(scene, camera);
};

window.addEventListener("load", () => {
  init();
  animate();
})

// =====================================
// NASA SPACE EXPLORER
// 3D EARTH BACKGROUND
// PART 1
// =====================================

// ---------- Scene ----------

const scene = new THREE.Scene();


// ---------- Camera ----------

const camera = new THREE.PerspectiveCamera(

45,

window.innerWidth / window.innerHeight,

0.1,

1000

);

camera.position.set(
0,
0,
7
);


// ---------- Renderer ----------

const renderer = new THREE.WebGLRenderer({

// =====================================
// CINEMATIC BLOOM
// =====================================

let composer;

let bloomPass;

alpha: true,

antialias: true

});

renderer.setPixelRatio(

window.devicePixelRatio

);

renderer.setSize(

window.innerWidth,

window.innerHeight

);

renderer.outputColorSpace =
THREE.SRGBColorSpace;

renderer.shadowMap.enabled = true;

document
.getElementById("earthScene")
.appendChild(renderer.domElement);


// ---------- Texture Loader ----------

const loader =
new THREE.TextureLoader();


// ---------- Galaxy Background ----------

const galaxyTexture =
loader.load("textures/starfield.jpg");

scene.background =
galaxyTexture;


// ---------- Ambient Light ----------

const ambientLight =
new THREE.AmbientLight(
0xffffff,
0.45
);

scene.add(
ambientLight
);


// ---------- Sun Light ----------

const sun =
new THREE.DirectionalLight(
0xffffff,
3.5
);

sun.position.set(
6,
2,
5
);

sun.castShadow = true;

scene.add(
sun
);


// ---------- Rim Light ----------

const rim =
new THREE.DirectionalLight(
0x77bbff,
1.5
);

rim.position.set(
-5,
0,
-6
);

scene.add(
rim
);


// ---------- Fill Light ----------

const fill =
new THREE.PointLight(
0x88ccff,
0.8
);

fill.position.set(
-4,
2,
2
);

scene.add(
fill
);


// ---------- Earth Group ----------

const earthGroup =
new THREE.Group();

scene.add(
earthGroup
);


// ---------- Reusable Variables ----------

let earth;

let clouds;

let atmosphere;

let moon;

let satellite;

// =====================================
// EARTH SYSTEM
// PART 2
// =====================================


// ================================
// LOAD EARTH TEXTURES
// ================================

const earthDayTexture =
loader.load(
"textures/earth_day.jpg"
);


const earthNightTexture =
loader.load(
"textures/earth_night.jpg"
);


const cloudTexture =
loader.load(
"textures/earth_clouds.png"
);




// ================================
// EARTH MATERIAL
// ================================

const earthMaterial =
new THREE.MeshStandardMaterial({

map: earthDayTexture,

roughness:0.8,

metalness:0.1

});



// ================================
// EARTH MODEL
// ================================


const earthGeometry =
new THREE.SphereGeometry(

2,

128,

128

);



earth =
new THREE.Mesh(

earthGeometry,

earthMaterial

);



earth.castShadow = true;

earth.receiveShadow = true;


earthGroup.add(
earth
);




// ================================
// NIGHT LIGHTS LAYER
// ================================


const nightMaterial =
new THREE.MeshBasicMaterial({

map:earthNightTexture,

transparent:true,

opacity:0.7

});



const nightEarth =
new THREE.Mesh(

earthGeometry,

nightMaterial

);



earthGroup.add(
nightEarth
);






// ================================
// CLOUD LAYER
// ================================


const cloudMaterial =
new THREE.MeshStandardMaterial({

map:cloudTexture,

transparent:true,

opacity:0.45,

depthWrite:false

});



clouds =
new THREE.Mesh(

new THREE.SphereGeometry(

2.03,

128,

128

),

cloudMaterial

);



earthGroup.add(
clouds
);






// ================================
// ATMOSPHERE GLOW
// ================================


const atmosphereMaterial =
new THREE.MeshBasicMaterial({

color:0x3aaaff,

transparent:true,

opacity:0.25,

side:THREE.BackSide,

blending:THREE.AdditiveBlending

});




atmosphere =
new THREE.Mesh(

new THREE.SphereGeometry(

2.15,

128,

128

),

atmosphereMaterial

);



earthGroup.add(
atmosphere
);






// ================================
// EARTH POSITION
// ================================


earthGroup.position.set(

0,

0,

0

);

// =====================================
// MOON SYSTEM
// PART 3
// =====================================


// Moon texture

const moonTexture =
loader.load(
"textures/moon.jpg"
);



// Moon material

const moonMaterial =
new THREE.MeshStandardMaterial({

map:moonTexture,

roughness:1

});



// Moon object

moon =
new THREE.Mesh(

new THREE.SphereGeometry(

0.55,

64,

64

),

moonMaterial

);



earthGroup.add(
moon
);



// Moon orbit settings

moon.userData = {

angle:0,

distance:4.5,

speed:0.002

};







// =====================================
// STARFIELD SYSTEM
// =====================================


const starGeometry =
new THREE.BufferGeometry();


const starCount = 10000;


const starPositions = [];



for(
let i=0;
i<starCount;
i++
){


const radius =
Math.random()*120 + 40;



const theta =
Math.random()*Math.PI*2;



const phi =
Math.acos(
(Math.random()*2)-1
);



const x =
radius *
Math.sin(phi) *
Math.cos(theta);



const y =
radius *
Math.sin(phi) *
Math.sin(theta);



const z =
radius *
Math.cos(phi);



starPositions.push(
x,
y,
z
);


}




starGeometry.setAttribute(

"position",

new THREE.Float32BufferAttribute(

starPositions,

3

)

);





const starMaterial =
new THREE.PointsMaterial({

color:0xffffff,

size:0.18,

transparent:true,

opacity:0.8

});




const starField =
new THREE.Points(

starGeometry,

starMaterial

);



scene.add(
starField
);





// =====================================
// GALAXY BACKGROUND SPHERE
// =====================================



const galaxyTexture =
loader.load(

"textures/starfield.jpg"

);



const galaxyMaterial =
new THREE.MeshBasicMaterial({

map:galaxyTexture,

side:THREE.BackSide

});



const galaxy =
new THREE.Mesh(

new THREE.SphereGeometry(

250,

64,

64

),

galaxyMaterial

);



scene.add(
galaxy
);






// =====================================
// SATELLITE SYSTEM
// =====================================



const satelliteGroup =
new THREE.Group();




const satelliteBody =
new THREE.Mesh(

new THREE.BoxGeometry(

0.18,

0.35,

0.18

),


new THREE.MeshStandardMaterial({

color:0xcccccc,

metalness:0.8,

roughness:0.3

})

);



satelliteGroup.add(
satelliteBody
);






// Solar panels


const panelMaterial =
new THREE.MeshStandardMaterial({

color:0x124b8c,

metalness:0.5

});




const leftPanel =
new THREE.Mesh(

new THREE.BoxGeometry(

0.7,

0.02,

0.3

),

panelMaterial

);



leftPanel.position.x =
-0.45;



satelliteGroup.add(
leftPanel
);





const rightPanel =
leftPanel.clone();



rightPanel.position.x =
0.45;



satelliteGroup.add(
rightPanel
);






// Antenna


const antenna =
new THREE.Mesh(

new THREE.CylinderGeometry(

0.02,

0.02,

0.3,

16

),

new THREE.MeshStandardMaterial({

color:0xffffff

})

);



antenna.position.y =
0.3;


satelliteGroup.add(
antenna
);





scene.add(
satelliteGroup
);





satelliteGroup.userData = {

angle:0,

distance:3.5,

speed:0.008

};

// =====================================
// ANIMATION ENGINE
// PART 4
// =====================================


// Camera movement variables

let cameraAngle = 0;





function animateEarth(){


requestAnimationFrame(
animateEarth
);





// ================================
// EARTH ROTATION
// ================================


if(earth){

earth.rotation.y += 0.002;

}



if(clouds){

clouds.rotation.y += 0.0028;

}






// ================================
// MOON ORBIT
// ================================


if(moon){


moon.userData.angle +=
moon.userData.speed;



moon.position.x =
Math.cos(
moon.userData.angle
)
*
moon.userData.distance;



moon.position.z =
Math.sin(
moon.userData.angle
)
*
moon.userData.distance;



moon.rotation.y +=
0.003;


}







// ================================
// SATELLITE ORBIT
// ================================


if(satelliteGroup){



satelliteGroup.userData.angle +=
satelliteGroup.userData.speed;




satelliteGroup.position.x =

Math.cos(
satelliteGroup.userData.angle
)

*

satelliteGroup.userData.distance;




satelliteGroup.position.z =

Math.sin(
satelliteGroup.userData.angle
)

*

satelliteGroup.userData.distance;



satelliteGroup.position.y =

Math.sin(
satelliteGroup.userData.angle * 2
)

*

0.4;



satelliteGroup.lookAt(
earth.position
);



}






// ================================
// STAR MOVEMENT
// ================================


if(starField){


starField.rotation.y +=
0.00005;



starField.rotation.x +=
0.00001;


}






// ================================
// GALAXY ROTATION
// ================================


if(galaxy){


galaxy.rotation.y +=
0.00002;


}







// ================================
// CINEMATIC CAMERA DRIFT
// ================================


cameraAngle +=
0.0003;



camera.position.x =

Math.sin(cameraAngle)
*
0.25;



camera.position.y =

Math.cos(cameraAngle)
*
0.12;



camera.lookAt(
0,
0,
0
);






// Render

renderer.render(

scene,

camera

);


}






// Start animation

animateEarth();







// =====================================
// RESPONSIVE RESIZE
// =====================================


window.addEventListener(

"resize",

function(){



camera.aspect =

window.innerWidth /

window.innerHeight;



camera.updateProjectionMatrix();




renderer.setSize(

window.innerWidth,

window.innerHeight

);



});

class loadcheck {
	constructor(){
		this.dk = false;
		this.imgbg = false;
		this.imgframe = false;
		this.imgbuildings = false;
		this.imgbridge = false;
		this.imgback = false;
	}

	loaded(){ 
		return this.dk && 
		this.imgbg && 
		this.imgframe && 
		this.imgbuildings && 
		this.imgbridge && 
		this.imgback;
	}
};

var session;
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

var allLoaded = new loadcheck();

window.mobilecheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

var isMobile = window.mobilecheck();

if(isMobile)
{
	console.log("IS MOBILE DEVICE")
}

function cameraToScreen(vec3, cam, width, height) {
	cam.updateMatrixWorld();
    var vector = vec3.project(cam);
    vector.x = (vector.x + 1) / 2 * width;
    vector.y = -(vector.y - 1) / 2 * height;
    return vector;
}

const fitCameraToObject = function ( cam, object, offset ) {

    offset = offset || 1.25;

    const boundingBox = new THREE.Box3();

    // get bounding box of object - this will be used to setup controls and camera
    boundingBox.setFromObject( object );

    const center = new THREE.Vector3();
    boundingBox.getCenter(center);

    const size = new THREE.Vector3();
    boundingBox.getSize(size);

    let s = size.y;

    let left = new THREE.Vector3(center.x - size.x / 2.0, center.y, -1);
   	let right = new THREE.Vector3(center.x + size.x / 2.0, center.y, -1);
    let screenPosLeft = cameraToScreen(left, cam, WIDTH, HEIGHT)
    let screenPosRight = cameraToScreen(right, cam, WIDTH, HEIGHT)

    if(screenPosLeft.x < 0 || screenPosRight.x > WIDTH)
    {
    	s = size.x;
    	//offset = 1.5;
    }

    var fov = cam.fov * Math.PI / 180;        // convert vertical fov to radians
    var cameraZ = (s/2) / Math.tan(fov/2)

    cameraZ *= offset; // zoom out a little so that objects don't fill the screen

    cam.position.z = cameraZ;
    cam.updateProjectionMatrix();

    cam.lookAt( center )

    //check if we went too far
    s = size.y;

    left = new THREE.Vector3(center.x - size.x / 2.0, center.y, -1);
   	right = new THREE.Vector3(center.x + size.x / 2.0, center.y, -1);
    screenPosLeft = cameraToScreen(left, cam, WIDTH, HEIGHT)
    screenPosRight = cameraToScreen(right, cam, WIDTH, HEIGHT)

    if(screenPosLeft.x < 0 || screenPosRight.x > WIDTH)
    {
    	console.log("use x again");
    	s = size.x;
    	offset = 1.5;

    	//reset
	    cameraZ = (s/2) / Math.tan(fov/2)

	    cameraZ *= offset; // zoom out a little so that objects don't fill the screen

	    cam.position.z = cameraZ;
	    cam.updateProjectionMatrix();

	    cam.lookAt( center )
    }
}

var started = false;

var audio = document.createElement('audio')
audio.src = "../../../savethedate/01 Come Fly With Me.mp3"
audio.preload = true
audio.volume = 0.3

var mouseEnabled = true;
var cardRot = 0;
var rotTarget = 0;
var postcard = { edge: null, bg: null, mask: null, us: null, back: null, buildings: null, bridge: null }

var depthkit;
var character;
var rotationStep = Math.PI / 9.0;

var scene = new THREE.Scene();
scene.background = new THREE.Color( 0xffffff );
var camera = new THREE.PerspectiveCamera( 75, WIDTH / HEIGHT, 0.01, 1000000 );

camera.position.z = 15;

var renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( WIDTH, HEIGHT );

var loader = new THREE.TextureLoader();

loader.load(
	'../../../photobooth/assets/frame.png',
	texture => {
		texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
		texture.minFilter = THREE.LinearFilter;
		texture.mipmap = true;
		postcard.edge = new THREE.Mesh( new THREE.PlaneGeometry( 15.58 * 2., 10 * 2. ), new THREE.MeshLambertMaterial({map:texture, transparent: true }) );
		//postcard.edge.material.depthWrite = false;
		//postcard.edge.material.depthTest = false;
		postcard.edge.renderOrder = 4;
		scene.add(postcard.edge);
		allLoaded.imgframe = true;

		fitCameraToObject(camera, postcard.edge)
	},
	undefined,
	function () {
		console.error( 'An error happened.' );
	}
);

loader.load(
	'../../../photobooth/assets/bg.jpg',
	function ( texture ) {
		// use the image, e.g. draw part of it on a canvas
		texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
		//texture.minFilter = THREE.LinearFilter;
		texture.mipmap = true;
		postcard.bg = new THREE.Mesh( new THREE.PlaneGeometry( 15.58 * 6., 10 * 6. ), new THREE.MeshLambertMaterial({map:texture}) );
		postcard.bg.position.z = -20;
		postcard.bg.renderOrder = 3;
		scene.add( postcard.bg );
		allLoaded.imgbg = true;
	},
	undefined,
	function () {
		console.error( 'An error happened.' );
	}
);

loader.load(
	'../../../photobooth/assets/bridge.png',
	function ( texture ) {
		texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
		//texture.minFilter = THREE.LinearFilter;
		texture.mipmap = true;
		postcard.bridge = new THREE.Mesh( new THREE.PlaneGeometry( 15.58 * 3.2, 10 * 3.2 ), new THREE.MeshLambertMaterial({map:texture, transparent: true}) );
		postcard.bridge.position.z = -8;
		postcard.bridge.renderOrder = 3;
		scene.add( postcard.bridge );
		allLoaded.imgbridge = true;
	},
	undefined,
	function () {
		console.error( 'An error happened.' );
	}
);

loader.load(
	'../../../photobooth/assets/buildings.png',
	function ( texture ) {
		texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
		//texture.minFilter = THREE.LinearFilter;
		texture.mipmap = true;
		postcard.buildings = new THREE.Mesh( new THREE.PlaneGeometry( 15.58 * 4., 10 * 4. ), new THREE.MeshLambertMaterial({map:texture, transparent: true}) );
		postcard.buildings.position.z = -13;
		postcard.buildings.renderOrder = 3;
		scene.add( postcard.buildings );
		allLoaded.imgbuildings = true;
	},
	undefined,
	function () {
		console.error( 'An error happened.' );
	}
);

loader.load(
	'../../../photobooth/assets/back.png',
	function ( texture ) {
		texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
		texture.minFilter = THREE.LinearFilter;
		texture.mipmap = true;
		postcard.back = new THREE.Mesh( new THREE.PlaneGeometry( 15.58 * 2., 10 * 2. ), new THREE.MeshLambertMaterial({ map:texture }) );
		postcard.back.renderOrder = 4;
		postcard.back.rotation.set(0,Math.PI,0)
		scene.add(postcard.back);
		allLoaded.imgback = true;
	},
	undefined,
	function () {
		console.error( 'An error happened.' );
	}
);

scene.add(postcard.back);

var maskUniforms = {
	u_radius: { type: "ve2", value: new THREE.Vector2() }
};

maskUniforms.u_radius.value.x = 0.35;
maskUniforms.u_radius.value.y = 0.26 * 1.558;

var maskMaterial = new THREE.ShaderMaterial( {
	uniforms: maskUniforms,
	vertexShader: document.getElementById( 'pass-vs' ).textContent,
	fragmentShader: document.getElementById( 'mask-fs' ).textContent
});

maskMaterial.colorWrite = false;

postcard.mask = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ), maskMaterial );
postcard.mask.position.z = -0.1
postcard.mask.renderOrder = 1;
scene.add( postcard.mask );

var sky = new THREE.Sky();
sky.scale.setScalar( 450000 );
scene.add( sky );

//This will add a starfield to the background of a scene
var starsGeometry = new THREE.Geometry();

for ( var i = 0; i < 1000; i ++ ) {

	var star = new THREE.Vector3();
	star = new THREE.Vector3(Math.random() * 2 - 1, Math.random(), -Math.random());
	star.normalize()
	star.x *= Math.max(500, 1000 * Math.random())
	star.y *= Math.max(500, 1000 * Math.random())
	star.z *= Math.max(500, 1000 * Math.random())
	starsGeometry.vertices.push( star );

}

var starsMaterial = new THREE.PointsMaterial( { color: 0xffffff } );

var starField = new THREE.Points( starsGeometry, starsMaterial );

scene.add( starField );

var effectController  = {
	turbidity: 13.1,
	rayleigh: 1.85,
	mieCoefficient: 0.041,
	mieDirectionalG: 0.8,
	luminance: 1,
	inclination: 0.505, // elevation / inclination
	azimuth: 0.2689, // Facing front,
	sun: false
};

var uniforms = sky.material.uniforms;
uniforms.turbidity.value = effectController.turbidity;
uniforms.rayleigh.value = effectController.rayleigh;
uniforms.luminance.value = effectController.luminance;
uniforms.mieCoefficient.value = effectController.mieCoefficient;
uniforms.mieDirectionalG.value = effectController.mieDirectionalG;

let sunpos = new THREE.Vector3(0,0,0);
let distance = 400000
var theta = Math.PI * ( effectController.inclination - 0.5 );
var phi = 2 * Math.PI * ( effectController.azimuth - 0.5 );
sunpos.x = distance * Math.cos( phi );
sunpos.y = distance * Math.sin( phi ) * Math.sin( theta );
sunpos.z = distance * Math.sin( phi ) * Math.cos( theta );
uniforms.sunPosition.value.copy(sunpos);

var directionalLight = new THREE.DirectionalLight( 0xFFFFFF, 1 );
directionalLight.position.set( 0, 100, 500 );
scene.add( directionalLight );

depthkit = new Depthkit();

var camTarget = {x: 0, y: 0};

function update()
{
	camera.position.x  += (camTarget.x - camera.position.x) * (isMobile ? 0.1 : 0.05)
	camera.position.y  += (camTarget.y - camera.position.y) * (isMobile ? 0.1 : 0.05)
	camera.lookAt(0,0,0);

	cardRot += (rotTarget - cardRot) * 0.06
	
	postcard.edge.rotation.set(0, -cardRot,0)
	postcard.bg.rotation.set(0, -cardRot,0)
	postcard.buildings.rotation.set(0, -cardRot,0)
	postcard.bridge.rotation.set(0, -cardRot,0)
	postcard.mask.rotation.set(0, -cardRot,0)
	if(postcard.us)
		postcard.us.rotation.set(0,Math.PI - cardRot,0)
	postcard.back.rotation.set(0,Math.PI - cardRot,0)

	if(cardRot > Math.PI / 2)
	{
		if(postcard.us)
			postcard.us.visible = false;
	}
	else
	{
		if(postcard.us)
			postcard.us.visible = true;
	}
	
}

function draw() {
	requestAnimationFrame( draw );
	update();
	renderer.render( scene, camera );
}

var waitInterval = null

function run(event)
{
	depthkit.load(
	`../../../photobooth/sessions/${session}/${session}.txt`,
	`../../../photobooth/sessions/${session}/${session}.mp4`,
	dkCharacter => {
		dkCharacter.setMeshScalar(2)
		postcard.us = dkCharacter;
		//Position and rotation adjustments
		dkCharacter.rotation.set( 0.3, Math.PI, 0);
		// dkCharacter.rotation.y = Math.PI;
		dkCharacter.position.set( 0, 1.0, -2.5 );
		dkCharacter.scale.set(25,25,25)
		// Depthkit video playback control
		depthkit.video.muted = "muted"; // Necessary for auto-play in chrome now
		depthkit.setLoop( true );
		//Add the character to the scene
		postcard.us.position.y = -3
		postcard.us.renderOrder = 4
		scene.add(postcard.us);
		allLoaded.dk = true;
	});

	depthkit.video.oncanplay = function()
	{
		$("#play-button").toggleClass("is-loading")
		$("#play-button").click(onPlay)
	}

	let loadsection = document.getElementById("load-section")
	loadsection.classList.add("is-hidden");

	let top = document.getElementById("top-nav")
	top.classList.remove("is-hidden");
	top.style.backgroundColor = "transparent";

	let bottom = document.getElementById("bottom-nav")
	bottom.classList.remove("is-hidden")
	bottom.style.backgroundColor = "transparent";

	started = true;
	let content = document.getElementById("content")
	content.classList.remove("is-hidden");
	content.onclick = flip;

	camera.aspect = content.clientWidth / content.clientHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( content.clientWidth, content.clientHeight );
	WIDTH = content.clientWidth;
	HEIGHT = content.clientHeight;
	fitCameraToObject(camera, postcard.edge);

	content.appendChild( renderer.domElement );

	draw();
	if(event){
		event.stopPropagation()
		event.preventDefault()
	}

}

function onPlay()
{
	$("#playmodal").toggleClass("is-active")
	audio.play();
	depthkit.play();
}

function mute()
{
	if(audio.muted)
	{
		audio.muted = false
		let mute = document.getElementById("vol-icon");
		mute.classList.remove('fa-volume-off');
		mute.classList.add('fa-volume-up');
	}
	else
	{
		audio.muted = true
		let mute = document.getElementById("vol-icon");
		mute.classList.remove('fa-volume-up');
		mute.classList.add('fa-volume-off');
	}
}

function flip()
{
	if(!started) return;

	mouseEnabled = !mouseEnabled;
	if(!mouseEnabled)
	{
		console.log("flipping to back!")
		camTarget.x = 0;
		camTarget.y = 0;
		rotTarget = Math.PI;
	}else{
		console.log("flipping to front!")
		rotTarget = 0;
	}
}

var maxDistance = { x: 8.5, y: 8.5};

function mouse(event) 
{

	if(!started) return;
	if(mouseEnabled)
	{
		let x = 0
		let y = 0

		if(event.touches)
		{
			x = (event.touches[0].clientX / document.documentElement.clientWidth) * 2.0 - 1.0
			y = (event.touches[0].clientY / document.documentElement.clientHeight) * 2.0 - 1.0	
		}
		else
		{
			x = (event.clientX / document.documentElement.clientWidth) * 2.0 - 1.0
			y = (event.clientY / document.documentElement.clientHeight) * 2.0 - 1.0	
		}
		
		camTarget.x = maxDistance.x * x
		camTarget.y = maxDistance.y * y
	}
}

var cue;
function onWindowResize() {
	if(cue){
		clearTimeout(cue);
	}
	cue = setTimeout(()=>{
		let content = document.getElementById("content")
		camera.aspect = content.clientWidth / content.clientHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( content.clientWidth, content.clientHeight );
		WIDTH = content.clientWidth;
		HEIGHT = content.clientHeight;
		fitCameraToObject(camera, postcard.edge);
	},1000)
}

window.addEventListener('resize', onWindowResize, false);

$(document).on('mousemove touchmove', function (event) {
	mouse(event)
	event.preventDefault()
	event.stopPropagation()
})

var clickMaxTime = 1.0;
var clickTime = 0;

window.addEventListener('touchstart', (event)=>{
	clickTime = Date.now()
}, false);

window.addEventListener('touchmove', (event)=>{
	mouse(event)
}, false);

window.addEventListener('touchend', (event)=>{

	let dur = (Date.now() - clickTime)/1000 
	if(dur < clickMaxTime && event.changedTouches.length == 1)
	{
		//tap
		console.log("TAP")
		if(!started)
			run()
	}

}, false);

window.addEventListener('touchcancel', (event)=>{
	clickTime = 0;
}, false);

function loaded()
{
	let header = document.getElementById("header");
	let sub = document.getElementById("subtext");
	let gif = document.getElementById("loading");
	let sessionId = document.getElementById("sessionId");
	session = sessionId.textContent

	console.log("found session: ", session)

	if ( !WEBGL.isWebGLAvailable() ) {
		header.innerHTML = "<a href='/wedding'>Click Here</a>";
		sub.innerHTML = "Uhoh! Your web browser isn't compatible with webGL, please click the above link to proceed to the login!";
	    gif.parentNode.removeChild(gif);
	}
	else
	{
		if(!started) run()
	}
}
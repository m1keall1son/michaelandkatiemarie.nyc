var userEmail = null;
var bgImages = []
//bgImages.push("images/sagrada.jpg")
bgImages.push("images/korea.jpg")
//bgImages.push("images/pub.jpg")
//bgImages.push("images/fence.jpg")

let index = Math.floor(Math.random()*bgImages.length)
let randImg = bgImages[index];
let body = document.getElementById("hero-body");
body.style.backgroundImage = "url('"+randImg+"')"
body.style.backgroundPosition = "center"; /* Center the image */
body.style.backgroundRepeat = "no-repeat"; /* Do not repeat the image */
body.style.backgroundSize = "cover";

let loginContainer = document.getElementById("login-container");
loginContainer.style.backgroundColor = "rgba(1.0, 1.0, 1.0., 0.25)"

function login()
{
	let reqbutton = document.getElementById("login-button")
	reqbutton.classList.add("is-loading")
}

function register_get(event)
{
	let reqbutton = document.getElementById("reg-button")
	reqbutton.classList.add("is-loading")

	event.preventDefault()
	event.stopPropagation()
	let req = new XMLHttpRequest();
	req.onreadystatechange = ()=> {
	    if (req.readyState == XMLHttpRequest.DONE) {
	    	console.log("made it")
	    	console.log(req.responseText)
	       	let form = document.getElementById("login-form")
	       	let button = document.getElementById("button-register")
	       	button.parentNode.removeChild(button)
	       	let parent = form.parentNode
	       	parent.removeChild(form)
	       	let div = document.createElement('div');
	       	div.innerHTML = req.responseText
	       	div.classList.add("container");
	       	parent.appendChild(div)
	    }
	};
	req.open("GET", "/register", true);
	req.send();
}

function register_post()
{
	let reqbutton = document.getElementById("reg-button")
	reqbutton.classList.add("is-loading")

	let emailfield = document.getElementById("user-email")
	userEmail = emailfield.value
	var req = new XMLHttpRequest()
	var url = '/register'
	var params = 'email='+userEmail
	console.log(params)
	req.open('POST', url, true)

	req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')

	req.onreadystatechange = function() {
	    if(req.readyState == XMLHttpRequest.DONE) {
	        let form = document.getElementById("register-form")
	       	let parent = form.parentNode
	       	parent.removeChild(form)
	       	let div = document.createElement('div');
	       	div.innerHTML = req.responseText
	       	div.classList.add("container");
	       	parent.appendChild(div)
	    }
	}

	req.send(params);
}

function createpass()
{
	let reqbutton = document.getElementById("pass-button")
	reqbutton.classList.add("is-loading")

	let userpass = document.getElementById("user-pass")

	var req = new XMLHttpRequest();
	var url = '/createpass';
	var params = 'email='+userEmail+"&password="+userpass;
	req.open('POST', url, true);

	req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

	req.onreadystatechange = function() {
	    if(req.readyState == 4 && req.status == 200) {
	        let form = document.getElementById("register-form")
	       	let parent = form.parentNode
	       	parent.removeChild(form)
	       	parent.innerHTML = req.responseText
	    }
	}

	req.send(params);
}

function request()
{
	let reqbutton = document.getElementById("req-button")
	reqbutton.classList.add("is-loading")

	let username = document.getElementById("user-name")
	let useremail = document.getElementById("user-email")

	var req = new XMLHttpRequest();
	var url = '/request';
	var params = 'email='+useremail.value+"&name="+username.value;
	req.open('POST', url, true);

	req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

	req.onreadystatechange = function() {
	    if(req.readyState == 4 && req.status == 200) {
	        let form = document.getElementById("request-form")
	       	let parent = form.parentNode
	       	parent.removeChild(form)
	       	parent.innerHTML = req.responseText
	    }
	}

	req.send(params);
}
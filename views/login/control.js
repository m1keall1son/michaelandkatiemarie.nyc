var userEmail = null;

function register_get(event)
{
	console.log("get register ajax")
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
	let emailfield = document.getElementById("user-email")
	userEmail = emailfield.value
	var req = new XMLHttpRequest()
	var url = '/register'
	var params = 'email='+userEmail
	console.log(params)
	req.open('POST', url, true)

	//Send the proper header information along with the request
	req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')

	req.onreadystatechange = function() {//Call a function when the state changes.
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
	let userpass = document.getElementById("user-pass")

	var http = new XMLHttpRequest();
	var url = '/createpass';
	var params = 'email='+userEmail+"&password="+userpass;
	http.open('POST', url, true);

	//Send the proper header information along with the request
	http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

	http.onreadystatechange = function() {//Call a function when the state changes.
	    if(http.readyState == 4 && http.status == 200) {
	        let form = document.getElementById("register-form")
	       	let parent = form.parentNode
	       	parent.removeChild(form)
	       	parent.innerHTML = req.responseText
	    }
	}

	http.send(params);
}

function request()
{

}
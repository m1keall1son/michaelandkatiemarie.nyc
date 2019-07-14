
function rsvp(family_id, user_id, traveling){

	let params = {
    	family: family_id,
    	guests: []
    }

	let rsvps = document.getElementsByClassName("rsvp")
    let allergies = document.getElementsByClassName("allergies")

    let cont = true;
    for(let i = 0; i < rsvps.length; i++){

    	let r = rsvps[i].value
    	if(r == ""){
    		cont = false;
    		break;
    	}

    	let guest = {}
    	guest.id = rsvps[i].dataset.guestid
    	guest.rsvp = r
    	guest.allergies = allergies[i].value || ""
    	params.guests.push(guest)
    }

    if(!cont){
    	$("#required").toggleClass("is-hidden")
    }

    if(traveling){

    	if($("#arrival").val() == "" && !$("#arrival").hasClass("is-danger")){
    		$("#arrival").addClass("is-danger")
    		$('#arrival-container').append('<div class="help is-danger has-text-left">Please enter the date your party arrives in NYC.</div>')
    		cont = false
    	}
    	if($("#accomodations-name").val() == "" && !$("#accomodations-name").hasClass("is-danger")){
    		$("#accomodations-name").addClass("is-danger")
    		$('#accomodations-name-container').append('<div class="help is-danger has-text-left">Please enter where your party is staying.</div>')
    		cont = false
    	}
    	if($("#accomodations-add1").val() == "" && !$("#accomodations-add1").hasClass("is-danger")){
    		$("#accomodations-add1").addClass("is-danger")
    		$('#accomodations-add1-container').append('<div class="help is-danger has-text-left">Please enter the address of your accomodations.</div>')
    		cont = false
    	}
    	if($("#accomodations-zip").val() == "" && !$("#accomodations-zip").hasClass("is-danger")){
    		$("#accomodations-zip").addClass("is-danger")
    		$('#accomodations-zip-container').append('<div class="help is-danger has-text-left">Please enter the zip code of your accomodations.</div>')
    		cont = false
    	}

    	if(cont){
	    	params.arrival = $("#arrival").val()
	    	params.accomodations = {
	    		name: $("#accomodations-name").val(),
	    		address: $("#accomodations-add1").val(),
	    		address2: $("#accomodations-add2").val() || "",
	    		zip: $("#accomodations-zip").val()
	    	}
	    }
    }

    if(!cont) return

 	let req = new XMLHttpRequest()
    req.addEventListener('load', function() { 
        $("#send-rsvp").toggleClass("is-loading")
        if(req.status == 200){
        	$("#invite").html("<div class='title is-family-vtks'>Thank You!</div><div class='subtitle is-family-natyl'>Love, Michael and KatieMarie</div>")
        }
        else{
        	$("#invite").html("<div class='title is-family-vtks'>Uh oh! Something went wrong!</div>")
        }

        let dst = $("#rsvp").offset().top
        $("html, body").animate({ scrollTop: dst}, 750)
    })
    req.addEventListener('error', function() { 
    	console.log("ERROR")
        $("#send-rsvp").toggleClass("is-loading")
    })

    req.open('POST','api/rsvp', true)
  	req.setRequestHeader( "Content-Type", "application/json" )
    req.send(JSON.stringify(params))

    $("#send-rsvp").toggleClass("is-loading")
}

function showSendButton(){
	if($("#send-rsvp").hasClass("is-hidden")){
        $("#send-rsvp").toggleClass("is-hidden")
    }
}

function rsvpYes(id) {

	let yesButtons = document.getElementsByClassName("rsvp-yes");
	let noButtons = document.getElementsByClassName("rsvp-no");

    let rsvps = document.getElementsByClassName("rsvp");

    for (i = 0; i < rsvps.length; i++) {
		if(rsvps[i].dataset.guestid == id){
			rsvps[i].value = "yes"
			break
		}
	}

	for (i = 0; i < noButtons.length; i++) {
		if(noButtons[i].dataset.guestid == id){
			if(!noButtons[i].classList.contains("is-outlined")){
				noButtons[i].classList.toggle("is-outlined")
			}
			if(noButtons[i].classList.contains("is-danger")){
				noButtons[i].classList.remove("is-danger")
				noButtons[i].classList.add("is-dark")
			}
			noButtons[i].disabled = false
			break
		}
	}

	for (i = 0; i < yesButtons.length; i++) {
		if(yesButtons[i].dataset.guestid == id){
			if(yesButtons[i].classList.contains("is-outlined")){
				yesButtons[i].classList.toggle("is-outlined")
			}
			if(!yesButtons[i].classList.contains("is-success")){
				yesButtons[i].classList.remove("is-dark")
				yesButtons[i].classList.add("is-success")
			}
			yesButtons[i].disabled = true
			break
		}
	}

	showSendButton()
}

function rsvpNo(id) {

   let yesButtons = document.getElementsByClassName("rsvp-yes");
	let noButtons = document.getElementsByClassName("rsvp-no");

    let rsvps = document.getElementsByClassName("rsvp");

    for (i = 0; i < rsvps.length; i++) {
		if(rsvps[i].dataset.guestid == id){
			rsvps[i].value = "no"
			break
		}
	}

	for (i = 0; i < noButtons.length; i++) {
		if(noButtons[i].dataset.guestid == id){
			if(noButtons[i].classList.contains("is-outlined")){
				noButtons[i].classList.toggle("is-outlined")
			}
			if(!noButtons[i].classList.contains("is-danger")){
				noButtons[i].classList.remove("is-dark")
				noButtons[i].classList.add("is-danger")
			}
			noButtons[i].disabled = true
			break
		}
	}

	for (i = 0; i < yesButtons.length; i++) {
		if(yesButtons[i].dataset.guestid == id){
			if(!yesButtons[i].classList.contains("is-outlined")){
				yesButtons[i].classList.toggle("is-outlined")
			}
			if(yesButtons[i].classList.contains("is-success")){
				yesButtons[i].classList.remove("is-success")
				yesButtons[i].classList.add("is-dark")
			}
			yesButtons[i].disabled = false
			break
		}
	}
	showSendButton()
}

function addGuest(id) {

}

function plusone(id, response, rehearsal, plusone_id){

	let url = "/api/update/family/"+ id +"/plusone/"

	if(plusone_id == null){
		url = "/api/new/family/"+ id +"/plusone/"
	}

	let params = {
		plusone_id: plusone_id,
		firstname:
		lastname:
		rsvp: response,
		rehearsal: rehearsal
	}

	let req = new XMLHttpRequest()
    req.addEventListener('load', function() { 
        $("#plusone-yes").toggleClass("is-loading")
        if(req.status == 200){
        	$("#plusone-content").html(req.responseText)
        }
        else{
        	console.log(req)
        	$("#plusone-content").html("<div class='title is-family-vtks'>Uh oh! Something went wrong! reload the page and try again.</div>")
        }
    })
    req.addEventListener('error', function() { 
    	console.log("ERROR")
    	$("#plusone-yes").toggleClass("is-loading")
    })

    req.open('POST', url, true)
  	req.setRequestHeader( "Content-Type", "application/json" )
    req.send(JSON.stringify(params))

    $("#plusone-yes").toggleClass("is-loading")
}

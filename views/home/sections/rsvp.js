
function rsvp(family_id, user_id){

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
    	return
    }

 	let req = new XMLHttpRequest()
    req.addEventListener('load', () => { 
        $("#send-rsvp").toggleClass("is-loading")
        console.log(req)
        if(req.status == 200){
        	$("#invite").html("<div class='title is-family-vtks'>Thank You!</div><div class='subtitle is-family-natyl'>Love, Michael and KatieMarie</div>")
        }
        else{
        	$("#invite").html("<div class='title is-family-vtks'>Uh oh! Something went wrong!</div>")
        }

        let dst = $("#rsvp").offset().top
        $("html, body").animate({ scrollTop: dst}, 750)
    })
    req.addEventListener('error', () => { 
    	console.log("ERROR")
        $("#send-rsvp").toggleClass("is-loading")
    })

    if($("#arrival").val() != ""){
    	params.arrival = $("#arrival").val()
    }

    if($("#departure").val() != ""){
    	params.departure = $("#departure").val()
    }

    if($("#departure").val() != ""){
    	params.accomodations = $("#accomodations").val()
    }

    if($("#rsvp-notes").val() != ""){
    	params.notes = $("#rsvp-notes").val()
    }

    req.open('POST','api/rsvp', true)
  	req.setRequestHeader( "Content-Type", "application/json" )
    req.send(JSON.stringify(params))

    $("#send-rsvp").toggleClass("is-loading")
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
			if(!yesButtons[i].classList.contains("is-primary")){
				yesButtons[i].classList.add("is-primary")
			}
			yesButtons[i].disabled = true
			break
		}
	}
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
			if(yesButtons[i].classList.contains("is-primary")){
				yesButtons[i].classList.remove("is-primary")
			}
			yesButtons[i].disabled = false
			break
		}
	}

}

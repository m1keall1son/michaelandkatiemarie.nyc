function guestListener () {
    $('#guests').append(this.responseText)
}

function refreshGuestInfo() {
    let req = new XMLHttpRequest();
    req.addEventListener('load', guestListener)
    req.open('GET','/api/adminlist')
    req.send()
}

$(document).ready(function() {
    refreshGuestInfo()
})

function updateGuestInfo(id) {
	let req = new XMLHttpRequest();
    req.addEventListener('load', function() { 
    	$("#guest-"+id+"-update").toggleClass("is-loading")
    })
    req.addEventListener('error', function() { 
    	$("#guest-"+id+"-update").toggleClass("is-danger")
    	$("#guest-"+id+"-update").toggleClass("is-loading")
    })
   	let params = 'id='+id+'&rehearsal='+$("input[name='guest-"+id+"-rehearsal']").is(':checked')
    req.open('POST','/api/guestupdate', true)
    req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    req.send(params)
    $("#guest-"+id+"-update").toggleClass("is-loading")
}






$(document).ready(function() {
    $("a.navbar-item").click(function(){
        let dataid = $(this).attr("data-id")
        if(dataid){
            let dst = $(dataid).offset().top
            $("html, body").animate({ scrollTop: dst}, 750)
        }
    })
    //special case
    $("#invite-button").click(function(){
    	let dst = $($(this).attr("data-id")).offset().top
    	$("html, body").animate({ scrollTop: dst}, 750)
    	$(".navbar-burger").toggleClass("is-active");  
     	$(".navbar-menu").toggleClass("is-active"); 
    })
})

function rsvpYes(id) {
    let req = new XMLHttpRequest();
    req.addEventListener('load', function(){ 
        $("#rsvp-yes-"+id).toggleClass("is-loading")
    })
    req.addEventListener('error', function(){ 
        $("#rsvp-yes-"+id).toggleClass("is-loading")
    })
    req.open('POST','/api/rsvp/yes/'+id)
    req.send()
    $("#rsvp-yes-"+id).toggleClass("is-loading")
}

function rsvpNo(id) {
    let req = new XMLHttpRequest();
    req.addEventListener('load', function(){ 
        $("#rsvp-no-"+id).toggleClass("is-loading")
    })
    req.addEventListener('error', function(){ 
        $("#rsvp-no-"+id).toggleClass("is-loading")
    })
    req.open('POST','/api/rsvp/no/'+id)
    req.send()
    $("#rsvp-no-"+id).toggleClass("is-loading")
}

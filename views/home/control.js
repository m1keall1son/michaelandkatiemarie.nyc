
$(document).ready(function() {
    $("a.navbar-item").click(function(){
    	let dst = $($(this).attr("data-id")).offset().top
    	$("html, body").animate({ scrollTop: dst}, 750)
    })
    //special case
    $("#invite-button").click(function(){
    	let dst = $($(this).attr("data-id")).offset().top
    	$("html, body").animate({ scrollTop: dst}, 750)
    	$(".navbar-burger").toggleClass("is-active");  
     	$(".navbar-menu").toggleClass("is-active"); 
    })
})

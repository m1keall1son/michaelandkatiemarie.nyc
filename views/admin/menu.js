$(document).ready(function() { 
	$(".navbar-burger").click(function() {
		$(".navbar-burger").toggleClass("is-active");  
	 	$(".navbar-menu").toggleClass("is-active"); 
	}); 
	$("a.navbar-item").click(function() {
	 	if($(this).attr('id') != "home"){
			$(".navbar-burger").toggleClass("is-active");  
			$(".navbar-menu").toggleClass("is-active"); 
		}
	}); 
}); 

$(document).find('html').addClass('has-navbar-fixed-top')
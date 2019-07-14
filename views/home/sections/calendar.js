function strip(str) {
    return str.replace(/^\s+|\s+$/g, '');
}

$(document).ready(function() {

	let options = {
		minDate: '10/01/2019',
		maxDate: '11/2/2019',
		lang: 'en',
		labelFrom: 'Arrival',
    	closeOnSelect: true,
    	showHeader: false,
    	dateFormat: "MM/DD",
    	showButtons: false
	}

	if($("#arrival").val() != "")
	{
		options.startDate = new Date( $("#arrival").val() + '/2019')
	}

	bulmaCalendar.attach('#stay-duration', options);

	const element = document.querySelector('#stay-duration');
	if (element) {
		// bulmaCalendar instance is available as element.bulmaCalendar
		element.bulmaCalendar.on('select', function(datepicker) {
			if($("#arrival").val() != datepicker.data.value()){
				if($("#send-rsvp").hasClass("is-hidden")){
			        $("#send-rsvp").toggleClass("is-hidden")
			    }
			    $("#arrival").val(datepicker.data.value())
			}
		});
	}
});
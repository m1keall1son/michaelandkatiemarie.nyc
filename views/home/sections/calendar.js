function strip(str) {
    return str.replace(/^\s+|\s+$/g, '');
}

$(document).ready(function() {

	let options = {
		minDate: '10/01/2019',
		maxDate: '11/2/2019',
		lang: 'en',
		labelFrom: 'From',
    	labelTo: 'To',
    	closeOnSelect: true,
    	showHeader: false,
    	dateFormat: "MM/DD",
    	showButtons: false
	}

	if($("#arrival").val() != "")
	{
		opions.startDate = new Date( $("#departure").val() + '/2019')
	}

	if($("#departure").val() != "")
	{
		opions.endDate = new Date( $("#departure").val() + '/2019')
	}

	bulmaCalendar.attach('#stay-duration', options);

	const element = document.querySelector('#stay-duration');
	if (element) {
		// bulmaCalendar instance is available as element.bulmaCalendar
		element.bulmaCalendar.on('select', datepicker => {
			let range = datepicker.data.value().split('-')
			$("#arrival").val(strip(range[0]))
			$("#departure").val(strip(range[1]))
		});
	}
});
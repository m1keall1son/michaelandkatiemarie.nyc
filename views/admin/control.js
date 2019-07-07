
function setupCalendars() {

    console.log("setting calendars...")

    $('.stay-duration').each((index, calendar) => {

        console.log("here")

        const family = calendar.dataset.familyid;

        console.log("setting calendar for family: ", family)

        const options = {
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

        if($("#arrival-" + family).val() != "")
        {
            options.startDate = new Date( $("#arrival-" + family).val() + '/2019')
        }

        if($("#departure-" + family).val() != "")
        {
            options.endDate = new Date( $("#departure-" + family).val() + '/2019')
        }

        bulmaCalendar.attach('#stay-duration-'+family, options);
    })
}

function guestListener () {
    $('#guests').append(this.responseText)
    setupCalendars()
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
    req.addEventListener('load', () => { 
    	$("#guest-"+id+"-update").toggleClass("is-loading")
    })
    req.addEventListener('error', () => { 
    	$("#guest-"+id+"-update").toggleClass("is-danger")
    	$("#guest-"+id+"-update").toggleClass("is-loading")
    })
   	let params = 'id='+id+'&rehearsal='+$("input[name='guest-"+id+"-rehearsal']").is(':checked')
    req.open('POST','/api/guestupdate', true)
    req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    req.send(params)
    $("#guest-"+id+"-update").toggleClass("is-loading")
}





function setupCalendar(id) {
    const options = {
        minDate: '10/01/2019',
        maxDate: '11/2/2019',
        lang: 'en',
        labelFrom: 'Arrival',
        closeOnSelect: true,
        showHeader: false,
        dateFormat: "MM/DD",
        showButtons: false
    }
    if($("#arrival-" + id).val() != "")
    {
        options.startDate = new Date( $("#arrival-" + id).val() + '/2019')
    }
    bulmaCalendar.attach('#cal-arrival-'+id, options)

    const element = document.querySelector('#cal-arrival-'+id)
    if (element) {
        // bulmaCalendar instance is available as element.bulmaCalendar
        element.bulmaCalendar.on('select', function(datepicker) {
            if($("#arrival-" + id).val() != datepicker.data.value()){
                if($("#update-travel-" + id).hasClass("is-hidden")){
                    $("#update-travel-" + id).toggleClass("is-hidden")
                }
                $("#arrival-" + id).val(datepicker.data.value())
            }
        });
    }
}

function setupCalendars() {
    $('.stay-duration').each(function(index, calendar) {
        const family = calendar.dataset.familyid;
        setupCalendar(family)
    })
}

function setupCardToggles() {
    let cardToggles = document.getElementsByClassName('card-toggle');
    for (let i = 0; i < cardToggles.length; i++) {
        cardToggles[i].addEventListener('click', function(e) {
            e.currentTarget.parentElement.childNodes[1].classList.toggle('is-hidden');
            e.currentTarget.childNodes[1].classList.toggle('is-hidden');
            e.currentTarget.childNodes[2].classList.toggle('is-hidden');
        });
    }
}

function guestListener () {
    if(this.status == 200){
        $('#guests').append(this.responseText)
        setupCalendars()
        setupCardToggles()
    }else{
        console.log(this)
    }
}

function refreshGuestInfo() {
    let req = new XMLHttpRequest();
    req.addEventListener('load', guestListener)
    req.open('GET','/api/adminlist')
    req.send()
}

document.addEventListener('DOMContentLoaded', function() {
    refreshGuestInfo()
});

////updates

function showUpdateBtn(id){
    if($("#guest-"+id+"-update").hasClass("is-hidden")){
        $("#guest-"+id+"-update").toggleClass("is-hidden")
    }
}

function showFamUpdateBtn(id){
    if($("#family-"+id+"-update").hasClass("is-hidden")){
        $("#family-"+id+"-update").toggleClass("is-hidden")
    }
}

function showFamUpdateTravelBtn(id){
    if($("#update-travel-"+id).hasClass("is-hidden")){
        $("#update-travel-"+id).toggleClass("is-hidden")
    }
}

function updateGuestInfo(id) {
    const params = { 
        rehearsal: $("input[name='guest-"+id+"-rehearsal']").is(':checked'),
        admin: $("input[name='guest-"+id+"-admin']").is(':checked')
     }

    const req = new XMLHttpRequest();
    req.addEventListener('load', function() { 
        $("#guest-"+id+"-update").toggleClass("is-loading")
        $("#guest-"+id+"-update").toggleClass("is-hidden")
    })
    req.addEventListener('error', function() { 
        $("#guest-"+id+"-update").toggleClass("is-danger")
        $("#guest-"+id+"-update").toggleClass("is-loading")
    })
    req.open('POST','/api/update/guest/'+id, true)
    req.setRequestHeader( "Content-Type", "application/json" )
    req.send(JSON.stringify(params))
    $("#guest-"+id+"-update").toggleClass("is-loading")
}

function updateFamilyInfo(id) {

    const params = {
        plusone: $("input[name='family-"+id+"-plusone']").is(':checked'),
        traveling: $("input[name='family-"+id+"-traveling']").is(':checked')
    }

    const req = new XMLHttpRequest();
    req.addEventListener('load', function() { 
        $("#family-"+id+"-update").toggleClass("is-loading")
        $("#family-"+id+"-update").toggleClass("is-hidden")

        if(!params.traveling && !$("#travel-details-"+id).hasClass("is-hidden")){
            $("#travel-details-"+id).addClass("is-hidden")
        }else {
            $("#record-content-travel-"+id).html(req.responseText)
            setupCalendar(id)
        }

    })
    req.addEventListener('error', function() { 
        $("#family-"+id+"-update").toggleClass("is-danger")
        $("#family-"+id+"-update").toggleClass("is-loading")
    })
    req.open('POST','/api/update/family/'+id, true)
    req.setRequestHeader( "Content-Type", "application/json" )
    req.send(JSON.stringify(params))
    $("#family-"+id+"-update").toggleClass("is-loading")
}

function updateFamilyTravelInfo(id) {

    const params = {
        arrival: $('#arrival-'+id).val(),
        accomodations: $('#accomodations-'+id).val(),
        address: $('#address-'+id).val(),
        address2: $('#address2-'+id).val(),
        zip: $('#zip-'+id).val(),
    }

    const req = new XMLHttpRequest();
    req.addEventListener('load', function() { 
        $("#update-travel-"+id).toggleClass("is-loading")
        $("#update-travel-"+id).toggleClass("is-hidden")
    })
    req.addEventListener('error', function() { 
        $("#update-travel-"+id).toggleClass("is-danger")
        $("#update-travel-"+id).toggleClass("is-loading")
    })
    req.open('POST','/api/update/family/travel/'+id, true)
    req.setRequestHeader( "Content-Type", "application/json" )
    req.send(JSON.stringify(params))
    $("#update-travel-"+id).toggleClass("is-loading")
}

function rsvp(id, response) {

    const params = {
        rsvp: response
    }

    const req = new XMLHttpRequest();
    req.addEventListener('load', function() { 
        $("#rsvp-control-"+id).toggleClass("is-loading")
        $("#response-"+id).html(req.responseText)
    })
    req.addEventListener('error', function() { 
        $("#rsvp-control-"+id).toggleClass("is-loading")
    })
    req.open('POST','/api/rsvp/'+id, true)
    req.setRequestHeader( "Content-Type", "application/json" )
    req.send(JSON.stringify(params))
    $("#rsvp-control-"+id).toggleClass("is-loading")
}





function setupCalendars() {
    $('.stay-duration').each(function(index, calendar) {
        const family = calendar.dataset.familyid;
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
    $('#guests').append(this.responseText)
    setupCalendars()
    setupCardToggles()
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
        }else if(params.traveling && $("#travel-details-"+id).hasClass("is-hidden")){
            $("#travel-details-"+id).removeClass("is-hidden")
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





$(document).ready(function() {
    
    function reqListener () {
        $('#guests').append(this.responseText)
    }

    console.log("sending req")
    var req = new XMLHttpRequest();
    req.addEventListener('load', reqListener)
    req.open('GET','/guest/adminlist')
    req.send()
    
})


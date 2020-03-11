//it just calls php so the session starts
$.ajax({    //create an ajax request to router.php
    type: "GET",
    url: "../php/router.php",  //no data so it only starts the session       
    dataType: "text",              
    success: function(response){
        console.log("Session started [session.js]");
    }
});
function signUp() {
    //hogy ne töltsön újra
    function handleForm(event) { 
        event.preventDefault(); 
        $.ajax({    //create an ajax request to router.php
            type: "POST",
            url: "../php/router.php",       
            dataType: "text",   //expect text to be returned                
            success: function(response){
                console.log(response);
            }
        });
    } 
    var signUpForm = document.getElementById("signUpForm");
    signUpForm.addEventListener("submit", handleForm);
}

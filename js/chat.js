/* jquery learning*/
function newMessageSend() {
    document.querySelector('#chat_write').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            //to make sure it has text and not only whitespaces / new lines
            if($('textarea#chat_write').val() && $('textarea#chat_write').val().trim().length > 0){ 
                $.ajax({    //create an ajax request to send chat message
                    type: "POST",
                    url: "../php/router.php",             
                    dataType: "json",   //expect html to be returned                
                    success: function(response){
                        
                    }
                });
            }
        }
    });
}
newMessageSend();
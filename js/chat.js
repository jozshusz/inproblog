/* jquery learning*/

// to load all chat messages from db (history)
$.ajax({    //create an ajax request to posts.php
    type: "GET",
    url: "../php/router.php",  
    data: { "get_all_chat": "to_do" },            
    dataType: "json",   //expect json to be returned                
    success: function(response){
        for (var i = 0; i < response.length; i++){
            var obj = response[i];
            var message_id = obj["chat_id"];
            var username = obj["username"];
            var date = obj["sent"];
            var chat_message = obj["message_text"];
            
            document.getElementById("chat_text_area_id").innerHTML += chat_message + "\n"; //to fill the chat area with msg
        }
    }
});

function newMessageSend(chat_message) {
    $.ajax({    //create an ajax request to send chat message
        type: "POST",
        url: "../php/router.php", 
        data: { "chat_write": chat_message },            
        dataType: "text",   //expect html to be returned                
        success: function(response){
            console.log(response);
            $('textarea#chat_message_id').val($('textarea#chat_message_id').val().replace(/(\r\n|\n|\r)/gm, ""));
            var toSend = $('textarea#chat_message_id').val().trim(); //to remove whitespaces
            document.getElementById("chat_text_area_id").innerHTML += toSend + "\n"; //to fill the chat area with msg
            document.getElementById("chat_message_id").value = ""; //to clear the message box after sending
        }
    });
}

document.querySelector('#chat_message_id').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        if(e.preventDefault) e.preventDefault(); //so enter does not create useless new lines
        var chat_message = $('textarea#chat_message_id').val();
        //to make sure it has text and not only whitespaces / new lines
        if(chat_message && chat_message.trim().length > 0){ 
            newMessageSend(chat_message);
        }
    }
});

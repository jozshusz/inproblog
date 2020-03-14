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
            var usernameText = obj["username"];
            var date = obj["sent"];
            var chat_message = obj["message_text"];

            var username = document.createElement("p");
            username.className = "chatUsername"; 
            username.innerHTML = usernameText; //this is the actual username text

            var chat_messageParagraph = document.createElement("p");
            chat_messageParagraph.className = "chatParagraph"; 
            chat_messageParagraph.setAttribute("id", obj["chat_id"]);
            chat_messageParagraph.innerHTML = chat_message;
            
            var chat_date = document.createElement("p");
            chat_date.className = "chatDate"; 
            chat_date.setAttribute("id", obj["chat_id"] + "date");
            chat_date.innerHTML = date;
            
            var chat_messageContainer = document.createElement("div");
            chat_messageContainer.setAttribute("id", obj["chat_id"] + "container");
            
            chat_messageContainer.append(chat_date);
            chat_messageContainer.append(chat_messageParagraph);
            chat_messageContainer.className = "chatMessageContainer";
            
            document.getElementById("chat_text_area_id").append(username);
            document.getElementById("chat_text_area_id").append(chat_messageContainer);
            
            //make scrollbar "follow" the messages
            var chatArea = document.getElementById("chat_text_area_id");
            chatArea.scrollTop = chatArea.scrollHeight;

            if(document.cookie.indexOf("username") != -1){
                var actualUser = document.cookie.split(';')[2].split("=")[1];

                //if admin, delete button needed
                if(actualUser === "admin"){
                    var chatDelete = document.createElement("button");
                    chatDelete.className = "chatDelete"; 
                    chatDelete.innerHTML = "X"; 
                    chatDelete.setAttribute("id", obj["chat_id"] + "chatDelete");
                    chatDelete.setAttribute("type", "button");
                    document.getElementById(obj["chat_id"] + "container").append(chatDelete);
                    chatDelete.onclick = (function(){ //now it passes the current and correct id of the button
                        var currentId = chatDelete.id;
                        return function() { 
                            self.removeMessage(currentId);
                        }
                    })();
                }
            }
            
        }
    }
});

function newMessageSend(chat_message) {
    
    if(document.cookie.indexOf("token") != -1){    
        $.ajax({    //create an ajax request to send chat message
            type: "POST",
            url: "../php/router.php", 
            data: { "chat_write": chat_message },            
            dataType: "text",   //expect html to be returned                
            success: function(response){
                var username = document.createElement("p");
                username.className = "chatUsername"; 
                username.innerHTML = response; //this is the actual username text
                $('textarea#chat_message_id').val($('textarea#chat_message_id').val().replace(/(\r\n|\n|\r)/gm, ""));
                var toSend = $('textarea#chat_message_id').val().trim(); //to remove whitespaces
                document.getElementById("chat_text_area_id").append(username);

                var chat_messageParagraph = document.createElement("p");
                chat_messageParagraph.className = "chatParagraph"; 
                chat_messageParagraph.innerHTML = toSend;

                document.getElementById("chat_text_area_id").append(chat_messageParagraph);
                document.getElementById("chat_message_id").value = ""; //to clear the message box after sending

                //make scrollbar "follow" the messages
                var chatArea = document.getElementById("chat_text_area_id");
                chatArea.scrollTop = chatArea.scrollHeight;
            }
        });
    }
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

function removeMessage(id) {
    //confirmation box; sweetalert2
    Swal.fire({
        title: 'Are you sure?',
        //text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
        }).then((result) => {

            // php call to delete
            $.ajax({    //create an ajax request
                type: "POST",
                url: "../php/router.php",     
                data: {"chat_msg_id": id},        
                dataType: "text",   //expect text to be returned                
                success: function(response){
                    console.log(response);
                }
            });

            // result box
            if (result.value) {
                Swal.fire('Message deleted.');

                //TO DO
                var messageId = parseInt(id);
                var message = document.getElementById(messageId);
                message.innerHTML = "Deleted";
                
            }
    })
}
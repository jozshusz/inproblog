//to do: session, keep the user logged in
document.querySelector('#signInForm').addEventListener('submit', function (e){
    event.preventDefault(); 
    var username = $('#signUsername').val();
    var password = $('#signPassword').val();
    $.ajax({    //create an ajax request to send chat message
        type: "POST",
        url: "../php/router.php", 
        data: { "signInUsername": username,
                "signInPassword": password },                
        dataType: "json",   //expect html to be returned                
        success: function(response){
            if(response === "Username does not exist."){
                //pw to default
                $("#signPassword").css("border-color", "#ccc");
                $("#passwordDiv").find("span").remove();

                $("#signUsername").css("border-color", "red");
                if(!$("#usernameDiv").find("span").length){
                    $("#usernameDiv").append('<span style="color: red; font-size: 8px; height: 2%; width: 2%; float: center;">Wrong username</span>');
                }
            }else if(response === "Wrong password."){
                //username to default
                $("#signUsername").css("border-color", "#ccc");
                $("#usernameDiv").find("span").remove();

                $("#signPassword").css("border-color", "red");
                if(!$("#passwordDiv").find("span").length){
                    $("#passwordDiv").append('<span style="color: red; font-size: 8px; height: 2%; width: 2%; float: center;">Wrong password</span>');
                }
            }else if(("username" in response[0]) && ("password" in response[0])){  //logging in, uname and pw good
                $("#signUsername").css("border-color", "#ccc");
                $("#signPassword").css("border-color", "#ccc");
                $("#passwordDiv").find("span").remove();
                $("#usernameDiv").find("span").remove();
                window.location.replace("../../index.html");
            }else{
                $("#signUsername").css("border-color", "#ccc");
                $("#signPassword").css("border-color", "#ccc");
                $("#passwordDiv").find("span").remove();
                $("#usernameDiv").find("span").remove();
                console.log("Error (ajax)");
            }
        }
    });
});

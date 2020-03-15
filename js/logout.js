//there is cookie[token] so somebody is logged in
//if so, log out the user
if(document.cookie.indexOf("token") != -1){ 
    var logoutMenuButton = document.createElement("a");
    logoutMenuButton.href = "#";
    logoutMenuButton.className = "menuNames";
    var logoutMenuItem = document.createElement("li");
    logoutMenuItem.className = "menuItems";
    logoutMenuItem.setAttribute("id", "logoutMenuItemId");
    logoutMenuItem.appendChild(logoutMenuButton);
    document.getElementById("menuNavId").appendChild(logoutMenuItem);
    logoutMenuButton.innerHTML = "Logout";

    logoutMenuButton.onclick = function(){
        event.preventDefault();

        var sPathMy = window.location.pathname;
        var currentPageMy = sPathMy.substring(sPathMy.lastIndexOf('/') + 1);
        //if newPost, different directory of php
        if(currentPageMy == "newPost.html"){
            $.ajax({   
                type: "POST",
                url: "../../php/router.php", 
                data: {"cookie_logout" : document.cookie.split(';')[1].split("=")[1],
                       "logout_user": "todo"},    
                dataType: "json",              
                success: function(response){
                    //window.location.replace("index.html");
    
                    // check which page is loaded, then navigate ALL of them to index.html
                    var sPath = window.location.pathname;
                    var currentPage = sPath.substring(sPath.lastIndexOf('/') + 1);
                    if(currentPage == "newPost.html"){
                        window.location.replace("../../index.html");
                    }
                }
            });
        }else{
            $.ajax({   
                type: "POST",
                url: "../php/router.php", 
                data: {"cookie_logout" : document.cookie.split(';')[1].split("=")[1],
                       "logout_user": "todo"},    
                dataType: "json",              
                success: function(response){
                    //window.location.replace("index.html");
    
                    // check which page is loaded, then navigate ALL of them to index.html
                    var sPath = window.location.pathname;
                    var currentPage = sPath.substring(sPath.lastIndexOf('/') + 1);
                    if(currentPage == "index.html"){
                        window.location.replace("index.html");
                    }else if(currentPage == "posts.html"){
                        window.location.replace("../index.html");
                    }else if(currentPage == "signup.html"){
                        window.location.replace("../index.html");
                    }else if(currentPage == "signin.html"){
                        window.location.replace("../index.html");
                    }else if(currentPage == "myprofile.html"){
                        window.location.replace("../index.html");
                    }else if(currentPage == "chat.html"){
                        window.location.replace("../index.html");
                    }else if(currentPage == "newPost.html"){
                        window.location.replace("../../index.html");
                    }
                }
            });
        }

        
    };
}

//if newPost.html, need to change Sign in button username (cookie check POST)
var sPathNew = window.location.pathname;
var currentPageNew = sPathNew.substring(sPathNew.lastIndexOf('/') + 1);
if(currentPageNew == "newPost.html"){
    $.ajax({    //create an ajax request to router.php
        type: "POST",
        url: "../../php/router.php",  //cookie_check data only
        data: {"cookie_check" : document.cookie.split(';')[1].split("=")[1]},    
        dataType: "json",              
        success: function(response){
            // sign in button transform to username
            var username = response[0]["username"];
            var status = response[0]["status"];
            $("#signInMenu").empty();
            var usernameList = document.createElement("li");
            usernameList.innerHTML = username;
            usernameList.className = "usernameCss";
            document.getElementById("menuNavId").appendChild(usernameList);
        }
    });
}
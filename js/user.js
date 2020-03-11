if(document.cookie.indexOf("token") != -1){
    $.ajax({    //create an ajax request to router.php
        type: "POST",
        url: "../php/router.php",  //cookie_check data only
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

            // check which page is loaded
            var sPath = window.location.pathname;
            var currentPage = sPath.substring(sPath.lastIndexOf('/') + 1);
            if(currentPage == "posts.html" && username === "admin"){
                $(".artBlock").each(function(){
                    var divId = $(this).attr("id");
                    var deleteId = $(this).attr("id") + "deleteButton";
                    //delete button for admin
                    var deleteForm = document.createElement("form");
                    deleteForm.setAttribute("method", "post");
                    deleteForm.setAttribute("enctype", "multipart/form-data");

                    ////// TO STOP FROM RELOADING
                    function handleForm(event) { event.preventDefault(); } 
                    deleteForm.addEventListener("submit", handleForm);

                    var deleteButton = document.createElement("button");
                    deleteButton.setAttribute("type", "submit");
                    //deleteButton.setAttribute("id", divId+"deleteButton"); 
                    deleteButton.setAttribute("name", "X");
                    deleteButton.setAttribute("id", deleteId); //for identifying which post to delete
                    deleteButton.innerHTML = "X";
                    deleteButton.className = "deleteButtonStyle";
                    deleteForm.appendChild(deleteButton);
                    document.getElementById(divId).appendChild(deleteForm);
                    deleteButton.onclick = (function(){ //now it passes the current and correct id of the button
                        var currentId = deleteButton.id;
                        return function() { 
                            self.removePost(currentId);
                        }
                    })();
                    // end of delete
                });
                // creating new post button
                var newPostForm = document.createElement("form");
                newPostForm.setAttribute("method", "post");
                newPostForm.setAttribute("enctype", "multipart/form-data");
                newPostForm.setAttribute("action", "../sub/admin/newPost.html");
                
                var newPostButton = document.createElement("input");
                newPostButton.setAttribute("value", "New post");
                newPostButton.setAttribute("type", "submit");
                newPostButton.className = "newStuffButton";
                newPostForm.appendChild(newPostButton);
                document.getElementById("outBlockId").appendChild(newPostForm);
            }
            /*else if(sPage  == "contact.php"){
                
            }*/
        }
    });
}

function removePost(id) {
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
            $.ajax({    //create an ajax request to posts.php
                type: "POST",
                url: "../php/router.php",     
                data: {"id": id},        
                dataType: "text",   //expect html to be returned                
                success: function(response){
                    console.log(response);
                }
            });

            // result box
            if (result.value) {
                Swal.fire('Post deleted.')
                //window.location.reload(true); 
                var divId = parseInt(id);
                var div = document.getElementById(divId);
                div.innerHTML = "";
                div.remove();
            }
    })
}
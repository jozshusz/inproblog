//not using
function newPostBeta() {
    var artBlockDiv = document.createElement("div");
    var article = document.createElement("article");
    var paragraphOfArticle = document.createElement("p");
    var node = document.createTextNode("New post.");
    paragraphOfArticle.appendChild(node);
   /*div.style.width = "100px";
    div.style.height = "100px";
    div.style.background = "red";
    div.style.color = "white";
    div.innerHTML = "Hello";*/
    artBlockDiv.className = "artBlock";
    article.className = "articleStyle";

    artBlockDiv.appendChild(article);
    article.appendChild(paragraphOfArticle);
    document.getElementById("postSection").appendChild(artBlockDiv);
	console.log("You added a new post!");
}

var self = this;

function loadPosts() {
    /*var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("demo").innerHTML =
        this.responseText;
      }
    };
    xhttp.open("GET", "ajax_info.txt", true);
    xhttp.send();*/

    //calling PHP file to get all the rows from post table
    //$(document).ready(function() { //if not commented out, the ajax call does not return anything
    $.ajax({    //create an ajax request to posts.php
        type: "GET",
        url: "../php/router.php",             
        data: { "get_all_posts": "to_do" },  
        dataType: "json",   //expect json to be returned                
        success: function(response){
            //iterate through response json to create posts (divs) with key - value pairs
            for (var i = 0; i < response.length; i++){
                var obj = response[i];
                for (var key in obj){
                    //console.log(obj[key]);
                }
                var artBlockDiv = document.createElement("div");
                var article = document.createElement("article");
                artBlockDiv.id = obj["id"];
                document.getElementById("postSection").appendChild(artBlockDiv);

                //delete button for admin; IT IS IMPLEMENTED IN user.js 
                /*var deleteForm = document.createElement("form");
                deleteForm.setAttribute("method", "post");
                deleteForm.setAttribute("enctype", "multipart/form-data");

                ////// TO STOP FROM RELOADING
                function handleForm(event) { event.preventDefault(); } 
                deleteForm.addEventListener("submit", handleForm);

                var deleteButton = document.createElement("button");
                deleteButton.setAttribute("type", "submit");
                //deleteButton.setAttribute("id", obj["id"]+"deleteButton"); 
                deleteButton.setAttribute("name", "X");
                deleteButton.setAttribute("id", obj["id"]+"deleteButton"); //for identifying which post to delete
                deleteButton.innerHTML = "X";
                deleteButton.className = "deleteButtonStyle";
                deleteForm.appendChild(deleteButton);
                document.getElementById(obj["id"]).appendChild(deleteForm);
                deleteButton.onclick = (function(){ //now it passes the current and correct id of the button
                    var currentId = deleteButton.id;
                    return function() { 
                        self.removePost(currentId);
                    }
                })();*/
                // end of delete

                //title of the post
                var displayTitleOfArticle = document.createElement("a");
                displayTitleOfArticle.href = "#";
                displayTitleOfArticle.className = "postDisplayTitle";
                var titleNode = document.createTextNode(obj["title"]);
                displayTitleOfArticle.appendChild(titleNode);

                //post text; if more than 88 length, then hide the remaining text
                var displayTextOfArticle = document.createElement("p");
                displayTextOfArticle.className = "postDisplayText";
                var articlePostText = obj["post_text"];
                if(articlePostText.length > 89){
                    articlePostText = articlePostText.substr(0, 88) + ("...");
                }

                var postTextNode = document.createTextNode(articlePostText);
                displayTextOfArticle.appendChild(postTextNode);

                artBlockDiv.className = "artBlock";
                article.className = "articleStyle";

                //additional datas for id, date etc
                artBlockDiv.setAttribute("data-created",obj["created_at"]); 
                artBlockDiv.setAttribute("data-updated",obj["updated_at"]);
                //artBlockDiv.setAttribute('data-id',obj["id"]);
                artBlockDiv.setAttribute("data-labels",obj["labels"]);

                artBlockDiv.appendChild(displayTitleOfArticle);
                artBlockDiv.appendChild(article);
                article.appendChild(displayTextOfArticle);

                // to create "Read the whole post" button
                var readWhole = document.createElement("a");
                readWhole.href = "#";
                readWhole.className = "readWholePost";
                var readButton = document.createTextNode("Click here to read it...");
                readWhole.appendChild(readButton);
                artBlockDiv.appendChild(readWhole);

                //create title and "read whole post" button's click event
                //title
                displayTitleOfArticle.onclick = (function(){ //now it passes the current and correct id of the button
                    var currentId = obj["id"];
                    return function() { 
                        self.displayPost(currentId);
                    }
                })();
                //"read whole post" button
                readWhole.onclick = (function(){ //now it passes the current and correct id of the button
                    var currentId = obj["id"];
                    return function() { 
                        self.displayPost(currentId);
                    }
                })();

                //date to display for post
                var createdDiv = document.createElement("div");
                createdDiv.className = "postCreatedAtDiv";
                var createdDate = obj["created_at"];
                var createdPar = document.createElement("p");
                createdPar.className = "postCreatedAt";
                var createdText = document.createTextNode(createdDate.split(" ")[0]);
                createdPar.appendChild(createdText);
                createdDiv.appendChild(createdPar);
                artBlockDiv.appendChild(createdDiv);
            }
        }
    });
    //});
}
loadPosts();

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

//display post AND creating comment section
function displayPost(id) { 
    // php call to display post
    $.ajax({  
        type: "POST",
        url: "../php/router.php",     
        data: {"display_post_id": id},        
        dataType: "json",              
        success: function(response){
            //console.log(response);
            document.getElementById("postSection").innerHTML = "";
            document.getElementById("rightColumnId").innerHTML = "";

            //// create the actual post of the given ID

            var artBlockDiv = document.createElement("div");
            var article = document.createElement("article");
            artBlockDiv.id = id;
            document.getElementById("postSection").appendChild(artBlockDiv);

            //title of the post
            var displayTitleOfArticle = document.createElement("p");
            displayTitleOfArticle.className = "postActualTitle";
            var titleNode = document.createTextNode(response[0]["title"]);
            displayTitleOfArticle.appendChild(titleNode);

            var displayTextOfArticle = document.createElement("p");
            displayTextOfArticle.className = "postDisplayText";
            var articlePostText = response[0]["post_text"];

            var postTextNode = document.createTextNode(articlePostText);
            displayTextOfArticle.appendChild(postTextNode);

            artBlockDiv.className = "artBlock";
            article.className = "articleStyle";

            //additional datas for id, date etc
            artBlockDiv.setAttribute("data-created", response[0]["created_at"]); 
            artBlockDiv.setAttribute("data-updated", response[0]["updated_at"]);
            artBlockDiv.setAttribute("data-labels", response[0]["labels"]);

            artBlockDiv.appendChild(displayTitleOfArticle);
            artBlockDiv.appendChild(article);
            article.appendChild(displayTextOfArticle);

            document.getElementById("leftColumnId").style.float="center";
            document.getElementById("leftColumnId").style.width="100%";

            //date to display for post
            var createdDiv = document.createElement("div");
            createdDiv.className = "postCreatedAtDiv";
            var createdDate = response[0]["created_at"];
            var createdPar = document.createElement("p");
            createdPar.className = "postCreatedAt";
            var createdText = document.createTextNode(createdDate.split(" ")[0]);
            createdPar.appendChild(createdText);
            createdDiv.appendChild(createdPar);
            artBlockDiv.appendChild(createdDiv);
            //// 
            
            // no need to have space for new post button
            document.getElementById("outBlockId").innerHTML = "";
            document.getElementById("outBlockId").remove();

            // Comments
            var commentSection = document.createElement("div");
            commentSection.className = "commentSectionContainer";
            commentSection.setAttribute("id", response[0] + "comment");
            
            var commentSectionHeader = document.createElement("div");
            commentSectionHeader.className = "commentHeader";
            var commentHeaderText = document.createTextNode("Kommentek");
            commentSectionHeader.appendChild(commentHeaderText);

            commentSection.appendChild(commentSectionHeader);
            document.getElementById("leftColumnId").appendChild(commentSection);

            
            //new comment
            var writeCommentButton = document.createElement("a");
            writeCommentButton.setAttribute("id", "writeCommentButtonId");
            writeCommentButton.className = "writeCommentButton";
            writeCommentButton.href = "#";
            var writeCommentText = document.createTextNode("Write a comment");
            writeCommentButton.appendChild(writeCommentText);
            commentSectionHeader.appendChild(writeCommentButton);

            var newCommentArea = document.createElement("div");
            newCommentArea.setAttribute("id", "newCommentAreaDivId");
            commentSection.appendChild(newCommentArea);

            var commentDiv = document.createElement("div");
            commentDiv.className = "commentDiv";
            commentDiv.setAttribute("id", "commentDivId");
            commentSection.appendChild(commentDiv);

            writeCommentButton.onclick = (function(){
                return function() { 
                    event.preventDefault();
                    self.newComment(response[0] + "comment", id);
                }
            })();
            //

            //load existing comments
            $.ajax({    //create an ajax request to router.php
                type: "GET",
                url: "../php/router.php",
                data: {"post_id": id,
                       "get_all_comments": "todo"},
                dataType: "json",              
                success: function(response){
                    console.log(response);

                    for(var j = 0; j < response.length; j++){
                        var loadedComment = document.createElement("div");
                        loadedComment.className = "loadedComment";
                        loadedComment.setAttribute("id", response[j]["id"]);
                        loadedComment.innerHTML = response[j]["comment"];
                        var loadedCommentDate = document.createElement("div");
                        loadedCommentDate.className = "loadedCommentDate";
                        var loadedCommentUsername = document.createElement("div");
                        loadedCommentUsername.className = "loadedCommentUsername";
                        var textDate = document.createTextNode(response[j]["sent"]);
                        var textUsername = document.createTextNode("@" + response[j]["username"]);
                        loadedCommentDate.appendChild(textDate);
                        loadedCommentUsername.appendChild(textUsername);
                        loadedComment.appendChild(loadedCommentUsername);
                        loadedComment.appendChild(loadedCommentDate);
                        commentDiv.appendChild(loadedComment);
                    }
                }
            });

        }
    });
}

function newComment(id, postId){
    //check if user is logged in
    if(document.cookie.indexOf("token") != -1){
        //hide new comment button
        document.getElementById("writeCommentButtonId").style.display = "none";


        // create the UI
        var commentDiv = document.getElementById("newCommentAreaDivId");

        //div act as a textarea
        var newCommentArea = document.createElement("div");
        newCommentArea.className = "newCommentArea";
        newCommentArea.contentEditable = "true";
        commentDiv.appendChild(newCommentArea);

        //send comment button
        var newCommentButton = document.createElement("button");
        newCommentButton.setAttribute("type", "button");
        newCommentButton.className = "newCommentButton";
        newCommentButton.innerHTML = "Send";
        commentDiv.appendChild(newCommentButton);

        newCommentButton.onclick = function(){
            var commentText = newCommentArea.innerHTML;
            console.log(commentText);
                $.ajax({    //create an ajax request to router.php
                    type: "POST",
                    url: "../php/router.php",
                    data: {"cookie" : document.cookie.split(';')[1].split("=")[1],
                           "new_comment": commentText,
                           "post_id": postId},    
                    dataType: "json",              
                    success: function(response){
                        window.location.reload(true); 
                    }
                });
        };
    }else{
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'You are not logged in!'
        });
    }
}

function errorEmailMsg(){
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!'
    })
}

async function emailPopUp(){
    //POP up with sweetalert2 to fill email and message 
    const { value: formValues } = await Swal.fire({
        title: 'Send email for me',
        html:
          '<input id="swal-input1" class="swal2-input" placeholder="E-mail">' +
          '<input id="swal-input2" class="swal2-input" placeholder="Header">'+
          '<textarea id="swal-input3-textarea-email" class="swal2-textarea" placeholder="Text">',
        focusConfirm: false,
        preConfirm: () => {
          return [
            document.getElementById('swal-input1').value,
            document.getElementById('swal-input2').value,
            document.getElementById('swal-input3-textarea-email').value
          ]
        }
    })
    
    if (formValues) {
        return formValues;
    }

}
//email send button
document.querySelector('#sendEmailHref').addEventListener('click', function (e) {
    //promise then
    emailPopUp().then(function(result){
        for(var i = 0; i < result.length; i++){
            if(result[i].trim().length == 0){
                return errorEmailMsg();
            }
        }
        $.ajax({    
            type: "POST",
            url: "../php/router.php",             
            data: { "email_address": result[0],
                    "email_header": result[1],
                    "email_text": result[2] },  
            dataType: "text",   //expect json to be returned                
            success: function(response){
                console.log(response);
                if(response === "E-mail successfully sent!"){
                    Swal.fire(
                        'E-mail sent',
                        'Thank you for your message',
                        'success'
                    )
                }else{
                    return errorEmailMsg();
                }
            }
        });
    });
    

    //to send with ajax to router.php
    /*$.ajax({    
        type: "POST",
        url: "../php/router.php",             
        data: { "email_address": "to_do" },  
        dataType: "json",   //expect json to be returned                
        success: function(response){

        }
    });*/
});

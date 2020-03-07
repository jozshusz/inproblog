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

                //delete button for admin
                var deleteForm = document.createElement("form");
                deleteForm.setAttribute("method", "post");
                deleteForm.setAttribute("enctype", "multipart/form-data");

                ////// TO STOP FROM RELOADING
                function handleForm(event) { event.preventDefault(); } 
                deleteForm.addEventListener("submit", handleForm);
                //////

                /////// hidden input to pass ID to php
                /*var hiddenInput = document.createElement("input");
                hiddenInput.setAttribute("type", "hidden");
                hiddenInput.setAttribute("value", obj["id"]+"deleteButton"); 
                hiddenInput.setAttribute("name", "idInput");
                deleteForm.appendChild(hiddenInput);*/
                ///////

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
                })();
                // end of delete

                //title of the post
                var displayTitleOfArticle = document.createElement("p");
                displayTitleOfArticle.className = "postDisplayTitle";
                var titleNode = document.createTextNode(obj["title"]);
                displayTitleOfArticle.appendChild(titleNode);

                //post text
                var displayTextOfArticle = document.createElement("p");
                displayTextOfArticle.className = "postDisplayText";
                var postTextNode = document.createTextNode(obj["post_text"]);
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

function newPost() {
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
    document.getElementById("leftColumnId").appendChild(artBlockDiv);
	console.log("You added a new post!");
}
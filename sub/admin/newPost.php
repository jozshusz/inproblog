<?php
//var_dump($_POST["title"]);
//die(); //for debugging

// echo '<pre>' . json_encode($valami, JSON_PRETTY_PRINT) . '</pre>'; 

/*header('Content-Type: text/html; charset=utf-8');
$conn = mysqli_connect('localhost', 'root', 'doingprod2jes2z');

if(!$conn){
    echo 'Error while connecting to the database.';
}
if(!mysqli_select_db($conn, 'inprodatabase')){
    echo 'Database not selected.';
}

$title = $_POST['title'];
$post_text = $_POST['post_text'];
$labels = 'noLabel';
$created_at = date("Y-m-d H:i:s");
$updated_at = date("Y-m-d H:i:s");

$sql = "INSERT INTO post (title, post_text, labels, created_at, updated_at) 
        VALUES ('$title','$post_text','$labels','$created_at','$updated_at')";

if(!mysqli_query($conn, $sql)){
    echo 'Cannot insert to database.';
}else{
    echo 'Message inserted';
}

header("refresh:1; url=../posts.html");*/
?>
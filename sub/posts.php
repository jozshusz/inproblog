<?php
/*var_dump($_REQUEST);
die();*/ //for debugging

/*header('Content-Type: text/html; charset=utf-8');

function getAllPosts() {
    $conn = mysqli_connect('localhost', 'root', 'doingprod2jes2z');

    if(!$conn){
        echo 'Error while connecting to the database.';
    }
    if(!mysqli_select_db($conn, 'inprodatabase')){
        echo 'Database not selected.';
    }

    $getRows = 'SELECT * FROM post';
    $query = mysqli_query($conn, $getRows);
    $json = mysqli_fetch_all($query, MYSQLI_ASSOC);
    return $json;
}

echo json_encode(getAllPosts());*/

?>
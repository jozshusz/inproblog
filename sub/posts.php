<?php
header('Content-Type: text/html; charset=utf-8');
$conn = mysqli_connect('localhost', 'root', 'doingprod2jes2z');

if(!$conn){
    echo 'Error while connecting to the database.';
}
if(!mysqli_select_db($conn, 'inprodatabase')){
    echo 'Database not selected.';
}

//$link = $_GET["link"];
$getRows = 'SELECT * FROM post';
$query = mysqli_query($conn, $getRows);
//$result = mysqli_fetch_assoc($query);
//$resultString = $result["post_text"];
//echo $resultString;
$json = mysqli_fetch_all($query, MYSQLI_ASSOC);
//echo json_encode($json );
foreach ($json as $row) {
    echo $row["title"] . "-" . $row["post_text"] ."<br/>";
}

?>
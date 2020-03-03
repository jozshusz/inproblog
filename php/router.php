<?php
header('Content-Type: text/html; charset=utf-8');

/*echo $_SERVER['REQUEST_METHOD'];
var_dump($_POST["title"]);
die();*/

switch ($_SERVER['REQUEST_METHOD']) {
    case "GET":
        ///////ALL POSTS
        //no query  --->  every post
        if (empty($_GET)) { 
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
            echo json_encode($json);
        }
        ///////

        break;
    case "POST":
        ///// INSERT
        if(!array_key_exists("id", $_POST) 
        && array_key_exists("title", $_POST) 
        && array_key_exists("post_text", $_POST)){
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
                
                header("refresh:1; url=../sub/posts.html");
        }
        /////

        ///// DELETE
        // only id passed with POST
        if(array_key_exists("id", $_POST)){
            header('Content-Type: text/html; charset=utf-8');
        
            $conn = mysqli_connect('localhost', 'root', 'doingprod2jes2z');
        
            if(!$conn){
                echo 'Error while connecting to the database.';
            }
            if(!mysqli_select_db($conn, 'inprodatabase')){
                echo 'Database not selected.';
            }

            if (isset($_POST["id"])) {
                    $postId = intval($_POST["id"]);
                    echo $postId;
            }
            $sql = "DELETE FROM post WHERE id=" . intval($postId);

            if(!mysqli_query($conn, $sql)){
                echo 'Could not delete the post.';
            }else{
                echo 'Post deleted.';
                //header("refresh:1; url=../sub/posts.html");
            }
        }
        /////
        
        break;
    default:
        echo "Wrong request method (not GET or POST).";
        break;
}

?>
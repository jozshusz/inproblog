<?php
session_start();
header("Content-Type: text/html; charset=utf-8");

/*echo $_SERVER['REQUEST_METHOD'];
var_dump($_POST["title"]);
die();*/

switch ($_SERVER["REQUEST_METHOD"]) {
    case "GET":
        /////// ALL POSTS
        // no query  --->  every post
        if (empty($_GET)) { 
            $conn = mysqli_connect("localhost", "root", "doingprod2jes2z");

            if(!$conn){
                echo "Error while connecting to the database.";
            }
            if(!mysqli_select_db($conn, "inprodatabase")){
                echo "Database not selected.";
            }

            $getRows = "SELECT * FROM post";
            $query = mysqli_query($conn, $getRows);
            $json = mysqli_fetch_all($query, MYSQLI_ASSOC);
            echo json_encode($json);
        }
        /////

        /////// ALL CHAT MESSAGE
        // get_all_chat key with to_do value, ajax passing these arguments
        //var_dump($_GET);
        if(array_key_exists("get_all_chat", $_GET)){
            $conn = mysqli_connect("localhost", "root", "doingprod2jes2z");

            if(!$conn){
                echo "Error while connecting to the database.";
            }
            if(!mysqli_select_db($conn, "inprodatabase")){
                echo "Database not selected.";
            }

            $getRows = "SELECT * FROM chat";
            $query = mysqli_query($conn, $getRows);
            $json = mysqli_fetch_all($query, MYSQLI_ASSOC);
            echo json_encode($json);
        }
        ///////

        break;
    case "POST":
        ///// INSERT POST
        //id, title, post_text passed
        if(!array_key_exists("id", $_POST) 
        && array_key_exists("title", $_POST) 
        && array_key_exists("post_text", $_POST)){
                $conn = mysqli_connect("localhost", "root", "doingprod2jes2z");

                if(!$conn){
                    echo "Error while connecting to the database.";
                }
                if(!mysqli_select_db($conn, "inprodatabase")){
                    echo "Database not selected.";
                }
                
                $title = $_POST["title"];
                $post_text = $_POST["post_text"];
                $labels = "noLabel";
                $created_at = date("Y-m-d H:i:s");
                $updated_at = date("Y-m-d H:i:s");
                
                $sql = "INSERT INTO post (title, post_text, labels, created_at, updated_at) 
                        VALUES ('$title','$post_text','$labels','$created_at','$updated_at')";
                
                if(!mysqli_query($conn, $sql)){
                    echo "Cannot insert to database.";
                }else{
                    echo "Post inserted";
                }
                
                header("refresh:1; url=../sub/posts.html");
        }
        /////

        ///// DELETE POST
        //only id passed with POST
        if(array_key_exists("id", $_POST)){
            header("Content-Type: text/html; charset=utf-8");
        
            $conn = mysqli_connect("localhost", "root", "doingprod2jes2z");
        
            if(!$conn){
                echo "Error while connecting to the database.";
            }
            if(!mysqli_select_db($conn, "inprodatabase")){
                echo "Database not selected.";
            }

            if (isset($_POST["id"])) {
                    $postId = intval($_POST["id"]);
                    echo $postId;
            }
            $sql = "DELETE FROM post WHERE id=" . intval($postId);

            if(!mysqli_query($conn, $sql)){
                echo "Could not delete the post.";
            }else{
                echo "Post deleted.";
                //header("refresh:1; url=../sub/posts.html");
            }
        }
        /////

        ///// SEND CHAT MESSAGE
        // chat_write, username, date posted 
        // TO DO: implement sign-in so username can be posted (NOW IT IS HARD-CODED)
        //var_dump($_POST);
        if(array_key_exists("chat_write", $_POST)){
            $conn = mysqli_connect("localhost", "root", "doingprod2jes2z");

            if(!$conn){
                echo "Error while connecting to the database.";
            }
            if(!mysqli_select_db($conn, "inprodatabase")){
                echo "Database not selected.";
            }
            
            if (isset($_POST["chat_write"])) {
                $chat_write = $_POST["chat_write"];
            }
            $sent_date = date("Y-m-d H:i:s");;
            $username = "Admin";
            
            $sql = "INSERT INTO chat (username, sent, message_text) 
                    VALUES ('$username', '$sent_date', '$chat_write')";
            
            if(!mysqli_query($conn, $sql)){
                echo "Cannot insert to database.";
            }else{
                echo "Message inserted\n";
            }
        }
        /////

        ////// SIGN UP
        // username, psw1, pws2 and email posted
        //var_dump($_POST);
        if(array_key_exists("signUpEmailName", $_POST) && array_key_exists("signUpUsername", $_POST) 
            && array_key_exists("signUpPswOne", $_POST) && array_key_exists("signUpPswTwo", $_POST)){

            $conn = mysqli_connect("localhost", "root", "doingprod2jes2z");

            if(!$conn){
                echo "Error while connecting to the database.";
            }
            if(!mysqli_select_db($conn, "inprodatabase")){
                echo "Database not selected.";
            }
            
            if (isset($_POST["signUpEmailName"])) {
                $email = $_POST["signUpEmailName"];
            }
            if (isset($_POST["signUpUsername"])) {
                $username = $_POST["signUpUsername"];
            }
            if (isset($_POST["signUpPswOne"])) {
                $password = $_POST["signUpPswOne"];
            }
            if (isset($_POST["signUpPswTwo"])) {
                $password_confirm = $_POST["signUpPswTwo"];
            }
            $today = date("Y-m-d H:i:s");
            $status = "member";
            $options = [     //for hashing
                "cost" => 11,
            ];

            //check if e-mail and username does not exist (otherwise dont insert)
            $check_sql = "SELECT username, email FROM user WHERE username='$username' OR email='$email'";
            $check_query = mysqli_query($conn, $check_sql);
            $check_data = mysqli_fetch_all($check_query, MYSQLI_ASSOC);
            if(count($check_data) > 0){  // already in database
                echo "Your username or e-mail address is already registered.\n";
            }else{ 
                if(strcmp($password, $password_confirm)){
                    echo "The passwords do not match.\n";
                }else{  // can be inserted
                    $password_hashed = password_hash($password, PASSWORD_BCRYPT, $options);
                    $sql = "INSERT INTO user (username, email, joined, password, status) 
                        VALUES ('$username', '$email', '$today', '$password_hashed', '$status')";
                    if(!mysqli_query($conn, $sql)){
                        echo "Cannot insert to database.";
                    }else{
                        echo "User inserted\n";
                        header("refresh:1; url=../sub/signin.html");
                    }
                }
            }
        }
        //////

        // SIGN IN 
        ///// username and password POST, and the array size == 2
        //var_dump($_POST);
        if(array_key_exists("signInUsername", $_POST) && array_key_exists("signInPassword", $_POST) 
            && count($_POST) == 2){
            $conn = mysqli_connect("localhost", "root", "doingprod2jes2z");

            if(!$conn){
                echo "Error while connecting to the database.";
            }
            if(!mysqli_select_db($conn, "inprodatabase")){
                echo "Database not selected.";
            }
            
            if (isset($_POST["signInUsername"])) {
                $signInUsername = $_POST["signInUsername"];
            }
            if (isset($_POST["signInPassword"])) {
                $signInPassword = $_POST["signInPassword"];
            }
            $options = [     //for hashing
                "cost" => 11,
            ];
            
            $sql = "SELECT * FROM user WHERE username='$signInUsername'";
            $check_query = mysqli_query($conn, $sql);
            $check_data = mysqli_fetch_all($check_query, MYSQLI_ASSOC);
            //$check_data[0]["password"] : password text of first row
            if(count($check_data) == 1){  // already in database, username passing to ajax
                //to check that database pw and posted pw match
                if(password_verify($signInPassword, $check_data[0]["password"])){


                    //////
                    // TO DO, thinking: new table user_token(user_id, valid_to, token) to manage tokens
                    // when logged in, (random guid cookie), generate unique id, save to database
                    // if valid_to, check token everytime to validate if username logged in
                    $token = uniqid();
                    $today = date("Y-m-d H:i:s");
                    $username = $check_data[0]["username"];
                    $user_id = $check_data[0]["id"];
                    $_SESSION["username"] = $username;
                    $_SESSION["token"] = $token;
                    $_SESSION["valid_to"] = $today;
                    //uniqid() : unique id
                    ///////


                    echo json_encode($check_data);
                }else{
                    echo json_encode("Wrong password.");
                }
            }elseif(count($check_data) == 0){
                echo json_encode("Username does not exist.");
            }else{
                echo json_encode("Error.");
            }
        }
        
        break;
    default:
        echo "Wrong request method (not GET or POST).";
        break;
}

?>
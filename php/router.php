<?php
session_id("2sessionId2");
session_start();
//$_GET from all files so session starts for every file, get has no parameters so it does not go into the ifs
header("Content-Type: text/html; charset=utf-8");


/*echo $_SERVER['REQUEST_METHOD'];
var_dump($_POST["title"]);
die();*/
//session-t is lehet dump

///// check if valid_to is expired, if so: delete the row of database

$database_conn = mysqli_connect("localhost", "root", "doingprod2jes2z");

if(!$database_conn){
    echo "Error while connecting to the database.";
}
if(!mysqli_select_db($database_conn, "inprodatabase")){
    echo "Database not selected.";
}

$get_valid_dates = "SELECT * FROM user_token";
$valid_to_query = mysqli_query($database_conn, $get_valid_dates);
$valid_to_rows = mysqli_fetch_all($valid_to_query, MYSQLI_ASSOC);
foreach($valid_to_rows as $element){
    if($element["valid_to"] <= date("Y-m-d H:i:s")){
        $delete_expired = "DELETE FROM user_token WHERE user_id=" . $element["user_id"];

        if(!mysqli_query($database_conn, $delete_expired)){
            echo "Could not delete the user_token row.";
        }
    }
}

//check session and delete if needed
if(isset($_SESSION["valid_to"])){
    if($_SESSION["valid_to"] <= date("Y-m-d H:i:s")){
        session_unset();
        session_destroy();
    }
}


/////

switch ($_SERVER["REQUEST_METHOD"]) {
    case "GET":
        /////PASSING SESSION VALUES
        //no $_GET parameters
        if(empty($_GET)){
            if(isset($_SESSION["username"]) && isset($_SESSION["user_id"]) && 
                isset($_SESSION["token"]) && isset($_SESSION["valid_to"])){
                    if($_SESSION["username"]!=="" && $_SESSION["user_id"]!=="" 
                        && $_SESSION["token"]!=="" && $_SESSION["valid_to"]!==""){
                            $json_to_send;
                            $json_to_send["username"] = $_SESSION["username"];
                            $json_to_send["user_id"] = $_SESSION["user_id"];
                            $json_to_send["token"] = $_SESSION["token"];
                            $json_to_send["valid_to"] = $_SESSION["valid_to"];
                            echo json_encode($json_to_send);
                    }
                }
            
        }

        /////// ALL POSTS
        // get_all_posts --> all posts
        if(array_key_exists("get_all_posts", $_GET)){
            //var_dump($_SESSION);
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
        //security: only run if session is admin
        if(isset($_SESSION["username"])){
            if($_SESSION["token"] == $_COOKIE["token"] && $_SESSION["username"] == "admin"){
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
            }
        }
        /////

        ///// DELETE POST
        //only id passed with POST
        //security: only run if session is admin
        if(isset($_SESSION["username"])){
            if($_SESSION["token"] == $_COOKIE["token"] && $_SESSION["username"] == "admin"){
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
            $sent_date = date("Y-m-d H:i:s");
            $username = $_SESSION["username"];
            
            $sql = "INSERT INTO chat (username, sent, message_text) 
                    VALUES ('$username', '$sent_date', '$chat_write')";
            
            if(!mysqli_query($conn, $sql)){
                echo "Cannot insert to database.";
            }else{
                echo $_SESSION["username"];
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
                    // thinking: new table user_token(user_id, valid_to, token) to manage tokens
                    // when logged in, (random guid cookie), generate unique id, save to database
                    // if valid_to, check token everytime to validate if username logged in
                    $token = uniqid();
                    $today = date("Y-m-d H:i:s");
                    $valid_to = date("Y-m-d H:i:s", strtotime('+100 seconds')); //valid for 20 minutes; now 10 sec
                    $username = $check_data[0]["username"];
                    $user_id = $check_data[0]["id"];
                    //insert to user_token db
                    $token_sql = "INSERT INTO user_token (user_id, token, valid_to) 
                        VALUES ('$user_id', '$token', '$valid_to')";
                    mysqli_query($conn, $token_sql);
                    //session variables
                    $_SESSION["username"] = $username;
                    $_SESSION["user_id"] = $user_id;
                    $_SESSION["token"] = $token;
                    $_SESSION["valid_to"] = $valid_to;
                    //uniqid() : unique id
                    ///////

                    //cookie create
                    $cookie_name = "token";
                    $cookie_value = $token;
                    setcookie($cookie_name, $cookie_value, time() + (100), "/");//cookie valid for 20 minutes; now 10 sec
                    
                    //cookie create
                    $cookie_nameUser = "username";
                    $cookie_valueUser = $_SESSION["username"];
                    setcookie($cookie_nameUser, $cookie_valueUser, time() + (100), "/");//cookie valid for 20 minutes; now 10 sec
                    
                    $check_data["token"] = $token;
                    $check_data["valid_to"] = $valid_to;

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

        ///// CHECK cookie
        // cookie_check posted (client side token)
        if(array_key_exists("cookie_check", $_POST)){
            if(isset($_POST["cookie_check"])){
                if($_POST["cookie_check"] == $_SESSION["token"]){
                    $conn = mysqli_connect("localhost", "root", "doingprod2jes2z");

                    if(!$conn){
                        echo "Error while connecting to the database.";
                    }
                    if(!mysqli_select_db($conn, "inprodatabase")){
                        echo "Database not selected.";
                    }
                    $user_id = $_SESSION["user_id"];
                    $session_sql = "SELECT username, status FROM user WHERE id='$user_id'";
                    $session_query = mysqli_query($conn, $session_sql);
                    $session_data = mysqli_fetch_all($session_query, MYSQLI_ASSOC);
                    echo json_encode($session_data);
                }
            }
        }

        ///// DELETE CHAT MESSAGE
        // chat_msg_id, date 
        //var_dump($_POST);
        if(isset($_SESSION["username"]) && isset($_SESSION["token"]) && isset($_COOKIE["token"])){
            if($_SESSION["token"] == $_COOKIE["token"] && $_SESSION["username"] == "admin"){
                if(array_key_exists("chat_msg_id", $_POST)){
                    $conn = mysqli_connect("localhost", "root", "doingprod2jes2z");

                    if(!$conn){
                        echo "Error while connecting to the database.";
                    }
                    if(!mysqli_select_db($conn, "inprodatabase")){
                        echo "Database not selected.";
                    }
                    
                    if (isset($_POST["chat_msg_id"])) {
                        $chat_msg_id = $_POST["chat_msg_id"];
                    }
                    $msg = "Deleted";
                    
                    $sql = "UPDATE chat SET message_text='$msg' WHERE chat_id=" . intval($chat_msg_id);
                    
                    if(!mysqli_query($conn, $sql)){
                        echo "Cannot delete message.";
                    }else{
                        echo "Message deleted";
                    }
                }
            }
        }
        /////

        ///// SEND EMAIL
        // email_address 
        //var_dump($_POST);
        if(isset($_SESSION["username"]) && isset($_SESSION["token"]) && isset($_COOKIE["token"])){
            if(array_key_exists("email_address", $_POST) &&
            array_key_exists("email_header", $_POST) &&
            array_key_exists("email_text", $_POST)){
                require_once "Mail.php";
                $email_address = $_POST["email_address"];
                $email_header = $_POST["email_header"];
                $email_text = $_POST["email_text"];
                $from = "From blog <" . $email_address . ">";
                $to = "<inproblog@gmail.com>";
                $subject = $email_header;
                $body = $email_text;

                $headers = array(
                    "From" => $from,
                    "To" => $to,
                    "Subject" => $subject
                );

                $smtp = Mail::factory("smtp", array(
                        "host" => "ssl://smtp.gmail.com",
                        "port" => "465",
                        "auth" => true,
                        "username" => "inproblog@gmail.com",
                        "password" => "fifa11online11"
                    ));

                $mail = $smtp->send($to, $headers, $body);

                if (PEAR::isError($mail)) {
                    echo($mail->getMessage());
                } else {
                    echo("E-mail successfully sent!");
                }
            }
            
        }
        /////
        
        break;
    default:
        echo "Wrong request method (not GET or POST).";
        break;
}

?>
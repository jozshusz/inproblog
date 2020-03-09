function signUp() {
    //so it does not refresh on load
    function handleForm(event) { 
        event.preventDefault(); 
        var password = $('#signUpPasswordOneId').val();
        var confirmPassword = $('#signUpPasswordTwoId').val();;
        if(password == confirmPassword){
            $('#signUpForm').submit();
            $("#signUpPasswordOneId").css("border-color", "green");
            $("#signUpPasswordTwoId").css("border-color", "green");
        }else{
            $("#signUpPasswordOneId").css("border-color", "red");
            $("#signUpPasswordTwoId").css("border-color", "red");
        }
    } 
    var signUpForm = document.getElementById("signUpForm");
    signUpForm.addEventListener("submit", handleForm);
}
signUp();

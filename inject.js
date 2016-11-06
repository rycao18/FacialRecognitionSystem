(function() {
    var usernameBox;
    var passwordBox;
    var inputs = document.getElementsByTagName("input");
    for(var i = 0; i < inputs.length; i++){
        if (inputs[i].type == "password") {
            usernameBox = inputs[i - 1];
            passwordBox = inputs[i];
        }
    }
})();
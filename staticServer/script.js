var socket = io('https://bugfreespork-server-pixelsquared.c9users.io');

var email = document.querySelector("#inputEmail");
var password = document.querySelector("#inputPassword");

$("form").submit(function(e){
    e.preventDefault();
    socket.emit('login', { username: email.value, password: password.value});
});

socket.on('token', function (data) {
    console.log(data);
});
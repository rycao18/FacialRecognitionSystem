var socket = io("https://bugfreespork-server-pixelsquared.c9users.io/");
socket.on("news", function(data) {
	socket.emit("my other event", { my: data});
	
});

$(function() {
	$("#register-form").submit(function(e) {
    	var username = e.target[0].value;
    	var password = e.target[1].value;

    	socket.emit('login', {username : username, password : password});



    	//Disable from further calls
    	$('#register-form').remove();
    	e.preventDefault();
  	});
});
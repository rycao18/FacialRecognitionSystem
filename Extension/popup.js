var socket = io("https://bugfreespork-server-pixelsquared.c9users.io/");
socket.on("news", function(data) {
	socket.emit("my other event", { my: data});

});


$(function() {
    chrome.storage.sync.get('token', function(result) {
        if(result["token"] == undefined || result["token"] == false)
        {
            document.getElementById("login-form").className = "cansee";
            document.getElementById("cleartoken").className = "hidden";
            document.getElementById("welcome").innerHTML = "Login";
            document.getElementById("welcome").style.color = "rgb(240,0,12)";
        }
        else
        {
            document.getElementById("cleartoken").className = "cansee";
            document.getElementById("welcome").innerHTML = "Welcome Back!";
            bodytag = document.getElementsByTagName("BODY")[0];
            htmltag = document.getElementsByTagName("HTML")[0];
            bodytag.style.height = "60px";
            htmltag.style.height = "60px";
            bodytag.style.width = "210px";
            htmltag.style.width = "210px";
            document.getElementById("cleartoken").onclick = function() {
                chrome.storage.sync.clear(function() {
                    var error = chrome.runtime.lastError;
                    if (error) {
                        console.error(error);
                    }
                })
            }
        }
    })
	$("#login-form").submit(function(e) {
    	var username = e.target[0].value;
    	var password = e.target[1].value;

    	socket.emit('login', {username : username, password : password});


    	//Disable from further calls
    	$('#login-form').remove();
			document.getElementById("welcome").innerHTML = "Processing..";
    	e.preventDefault();
  	});
    socket.on('token', function (data) {
        if(data == false) {
            document.getElementById("welcome").innerHTML = "Please enter valid login info!";
        }
        else {
            chrome.storage.sync.set({'token': data});
            document.getElementById("welcome").style.color = "rgb(0, 172, 58)";
            document.getElementById("welcome").innerHTML = "Success!"
        }
        chrome.storage.sync.set({'token': data});
    });
});

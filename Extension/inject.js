(function() {
    var usernameBox;
    var passwordBox;
    var inputs = document.getElementsByTagName("input");
    var socket = io("https://facial-recognition-system-pixelsquared.c9users.io/");
    for(var i = 0; i < inputs.length; i++){
        if (inputs[i].type == "password") {
            usernameBox = inputs[i - 1];
            passwordBox = inputs[i];
        }
    }

    usernameBox.onfocus = function(){
        var html = '<div id="myModal">';
        html += '<div id="mymodal-content">';
        html += '<div id="mygoodcontainer">';
        html += '<video autoplay="true" id="videoElement"></video>';
        html += '<canvas id="myCanvas" height = "375px" width = "500px"></canvas>'
        html += '<p id="count"></p>'
        html += '</div>';
        html += '<link rel = "stylesheet" type = "text/css" href = "chrome-extension://lpcalookodbeanoaobpcgfnnoonbjblo/newstyle.css">';
        html += '</div>';
        html += '</div>';

        document.getElementsByTagName("BODY")[0].innerHTML += html;

        var modal = document.getElementById('myModal');

        modal.style.display = "inline";

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
        var video = document.querySelector("#videoElement");
        var canvas = document.getElementById('myCanvas');
 
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
         
        if (navigator.getUserMedia) {       
            navigator.getUserMedia({video: true}, handleVideo, videoError);
        }
         
        function handleVideo(stream) {
            video.src = window.URL.createObjectURL(stream);
        }
         
        function videoError(e) {
            console.log(e);
        }
        var myVar = setInterval(function(){ myTimer() }, 1500);
        var newmyVar = myVar;
        var picArray = [];

        function myTimer() {
            canvas.getContext('2d').drawImage(video, 0, 0);
            var data = canvas.toDataURL("image/jpeg");
            picArray.push(data);
            newmyVar += 1;
            document.getElementById("count").innerHTML = (myVar + 5 - newmyVar);
            if (newmyVar == myVar + 5) {
                clearInterval(myVar)
                socket.emit('processImage', {data: picArray});
                modal.style.display = "none";
            }
        }
    };
})
();
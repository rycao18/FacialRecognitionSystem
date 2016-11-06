document.write('\
\
<div id="myModal" class="modal">\
\
	<div class="modal-content">\
	<style>\
        #container {\
            margin: 0px auto;\
            width: 500px;\
            height: 375px;\
            border: 10px #333 solid;\
        }\
        #videoElement {\
            width: 500px;\
            height: 375px;\
            background-color: #666;\
        }\
        </style>\
        <input>\
        <div id="container">\
            <video autoplay="true" id="videoElement"></video>\
        </div>\
        <script>\
            var video = document.querySelector("#videoElement");\
 \
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;\
             \
            if (navigator.getUserMedia) {       \
                navigator.getUserMedia({video: true}, handleVideo, videoError);\
            }\
             \
            function handleVideo(stream) {\
                video.src = window.URL.createObjectURL(stream);\
            }\
             \
            function videoError(e) {\
                console.log(e);\
            }\
        </script>\
    <span class="close">x</span>\
    <p>Some text in the Modal..</p>\
	</div>\
\
</div>\
\
');
var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var fs = require('fs');
var cradle = require('cradle');
var password = require('password-hash-and-salt');
const spawn = require('child_process').spawn;
var c = new(cradle.Connection)('https://couchdb.bugfreespork.tk', 443, {
    cache: true,
    raw: false,
    forceSave: true,
    secure: true,
    auth: { username: 'joshua', password: '123blast123' },
    request: {
        //Pass through configuration to `request` library for all requests on this connection.
    }
});

app.listen(8080);

console.log("Server started");

var users = c.database('users');

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.on('connection', function (socket) {
    socket.on('login', function (data) {
        console.log(data.username);
        users.view('user/byUsername', { key: data.username }, function (err, res) {
            console.log(err);
            var token = Math.random().toString(36);
            if(res[0]){
                console.log(res[0].value.stuff);
                var value = res[0].value;
                value.token = token;
                users.save(res[0].value._id, res[0].value._rev, value, function (err, res) {
                    token = false;
                    console.log(err);
                });
            }else{
                token = false;
            }
        if (io.sockets.connected[socket.id]) {
            io.sockets.connected[socket.id].emit('token', token);
        }
        });
    });
    socket.on('reqestPassword', function (data) {
        console.log(data);
    });
    socket.on('processImage', function (data) {
        var fileList = [];
        for (var i = 0; i < 5; i++) {
            var token = Math.random().toString(36);
            var string = data.data[i];
            var regex = /^data:.+\/(.+);base64,(.*)$/;

            var matches = string.match(regex);
            var ext = "jpg";
            var base64Data = matches[2];
            var buffer = new Buffer(base64Data, 'base64');
            fs.writeFileSync('/tmp/data-' + token + '.' + ext, buffer);
            fileList.push('/tmp/data-' + token + '.' + ext);
        }
        console.log(fileList);
        const img = spawn('python', ['/home/ubuntu/workspace/pythonForServer/General.py', fileList[0], fileList[1], fileList[2], fileList[3], fileList[4]]);
        img.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });
        img.stderr.on('data', (data) => {
            console.log(`stderr: ${data}`);
        });
        img.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        });
    });
});
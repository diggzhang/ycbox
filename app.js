var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');
var os = require('os');
//var model = require('./model');
var ifaces = os.networkInterfaces();
var localHost = os.hostname();

app.listen(8000);

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

var sendIpStr = "";
for (var dev in ifaces) {
    var alias=0;
    ifaces[dev].forEach(function(details){
        if (details.family=='IPv4') {
            sendIpStr = details.address;
            console.log(details.address);
            //socket.emit('news', { hello: 'world' , IP: sendStr});
            ++alias;
        }
    });
};



io.on('connection', function (socket) {

    socket.emit('news', { LocalHost: localHost, IP: sendIpStr });
    socket.on('my other event', function (data) {
        console.log(data);
    });
});

console.log('Server running');

var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');
var os = require('os');
var model = require('./model');
var ifaces = os.networkInterfaces();
var localHost = os.hostname();

var portNum = 8000;
app.listen(portNum);

// Find Interface
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
};



io.on('connection', function (socket) {
	var newBox = new model({
		hostName: localHost,
		ipAddress: sendIpStr
	});

    model.get(newBox.ipAddress, function (err ,box) {
        if (box) {
            console.log('Box Aleary Saved');
        } else {
            newBox.save(function (err, box) {
                if (err) {
                    console.log(err);
                    return err;
                }
                console.log("save: " + box);
            });
        };
    });

    socket.emit('ipListen', { LocalHost: localHost, IP: sendIpStr });

    socket.on('successGetIp', function (data) {
        console.log(data);
    });
});

console.log('Server running on Port: ' + portNum);

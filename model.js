var mongodb = require('./db');

function Box(box) {
    this.hostName = box.hostName;
    this.ipAddress = box.ipAddress;
}

module.exports = Box;

Box.prototype.save = function (callback) {

    var box = {
        hostName: this.hostName,
        ipAddress: this.ipAddress
    }

    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        };
    });
};

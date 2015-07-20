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

        db.collection('boxes', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            };

            collection.insert(box, {
	            safe: true
            }, function (err, box) {
	            mongodb.close();
	            if (err) {
		            return callback(err);
	            }
	            callback(null, box[0]);
            });
        });
    });
};

Box.get = function (ipAddress, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            mongodb.close();
            return callback(err);
        };

        db.collection('boxes', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            };

            collection.findOne({
                ipAddress: ipAddress
            }, function (err, ipAddress) {
                mongodb.close();

                if (err) {
                    return callback(err);
                }

                callback(null, ipAddress);
            });
        })
    });
    
};

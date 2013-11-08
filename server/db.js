var mongodb = require('mongodb'),
    MongoClient = mongodb.MongoClient;

module.exports = function(bcrypt) {

    var db, err;
    var self = {
        connect: function(callback) {
            MongoClient.connect("mongodb://localhost:27017/adjunct", function(err_, db_) {
            //MongoClient.connect("mongodb://nader:adj0nct@paulo.mongohq.com:10043/adjunct", function(err_, db_) {
                err = err_;
                db = db_;
                callback();
            });
        },
        insertUser: function (user, callback) {
            var collection = db.collection('users');
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(user.password, salt, function(err, hash) {
                    user.password = hash;
                    collection.insert([user], function (err) {
                        if (err) {
                            return console.error(err);
                        }
                        else {
                            if (callback)
                                callback(err, user);
                        }
                    });
                });
            });
        },
        getUser: function (user, callback) {
            var collection = db.collection('users');
            var result = collection.find({$and: [{'email': {$exists: true}}, {'email': user.email}]});
            result.toArray(function(err, docs) {
                if (docs.length == 0) {
                    result = collection.find({'facebookId': user.facebookId});
                    result.toArray(function(err, docs) {
                        if (docs.length == 0) {
                            callback(null, []);
                        }
                        else {
                            callback(null, docs[0]);
                        }
                    });
                }
                else {
                    callback(null, docs[0]);
                }
            });
        },
        findOrCreate: function(user, callback)  {
            var collection = db.collection('users');
            collection.find(user).toArray(function(err, docs){
                if (docs.length > 0)
                    callback(err, docs[0]);
                else {
                    self.insertUser(user, function() { callback(err, docs[0]); });
                }
            });

        }
    };
    return self;
}
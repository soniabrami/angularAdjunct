
module.exports = function (mongodb, db, bcrypt) {

    var ObjectID = mongodb.ObjectID;

    var self = {
        insertUser: function (user, callback) {
            var collection = db.collection('users');
            if (user.password) {
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(user.password, salt, function (err, hash) {
                        user.password = hash;
                        collection.insert([user], function (err, docs) {
                            if (err) {
                                return console.error(err);
                            }
                            else {
                                if (callback) {
                                    delete docs[0].password;
                                    callback(err, docs[0]);
                                }
                            }
                        });
                    });
                });
            }
            else {
                collection.insert([user], function (err, dbUser) {
                    if (err) {
                        return console.error(err);
                    }
                    else {
                        if (callback)
                            callback(err, dbUser);
                    }
                });
            }
        },
        updateUser: function (user, callback) {
            var query = {'_id': user._id };
            this.getUser(query, function (err, u) {
                if (err) {
                    return console.error(err);
                }

                var collection = db.collection('users');
                user.password = u.password;
                var o_id = new ObjectID(u._id);
                delete user._id;
                collection.update({'_id': o_id}, user, function (err, dbUser) {
                    if (err) {
                        return console.error(err);
                    }
                    if (callback)
                        callback(err, dbUser);
                });
            });
        },
        updateUserField: function (_id, field, callback) {
            var collection = db.collection('users');
            var o_id = new ObjectID(_id);
            collection.update({'_id': o_id}, {'$set': field}, function (err, user) {
                if (err) {
                    return console.error(err);
                }
                if (callback)
                    callback(err, user);
            });
        },
        addUserJob: function (_id, field, callback) {
            var collection = db.collection('users');
            var o_id = new ObjectID(_id);
            collection.update({'_id': o_id}, {'$push': field}, function (err, user) {
                if (err) {
                    return console.error(err);
                }
                if (callback)
                    callback(err, user);
            });
        },
        getUser: function (user, callback) {
            var collection = db.collection('users');
            if (user._id) {
                var o_id = new ObjectID(user._id);
                user._id = o_id;
            }
            collection.find(user)
                .toArray(function (err, docs) {
                    if (err) {
                        return console.error(err);
                    }
                    if (docs.length == 0) {
                        callback(null, null);
                    }
                    else {
                        docs[0]._id = docs[0]._id.toHexString();
                        callback(null, docs[0]);
                    }
                });
        },
        getUsers: function (callback) {
            var collection = db.collection('users');
            collection.find()
                .toArray(function (err, docs) {
                    if (err) {
                        return console.error(err);
                    }
                    if (docs.length == 0) {
                        callback(null, null);
                    }
                    else {

                        for (var i = 0; i < docs.length; i++) {
                            delete docs[i].password;
                        }

                        callback(null, docs);
                    }
                });
        }
    };
    return self;
}
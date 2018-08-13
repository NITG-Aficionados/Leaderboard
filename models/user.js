let mongoose = require('mongoose');
let bcrypt = require('bcrypt');
// mongoose.connect('mongodb://localhost/leaderboard');
// let db=mongoose.connect;

let UserSchema = mongoose.Schema({
    username: {
        type: String,
        index: true
    },
    password: {
        type: String, required: true, bcrypt: true
    },
    email: {
        type: String
    },
    name: {
        type: String
    }
});

let User = module.exports = mongoose.model('User', UserSchema);

module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};


module.exports.getUserById = function (id, callback) {
    User.findById(id, callback);
};


module.exports.getUserByUsername = function (username, callback) {
    let query = {username: username};
    User.findOne(query, callback);
};


module.exports.createUser = function (newUser, callback) {

    bcrypt.hash(newUser.password, 10, function (err, hash) {
        if (err) throw err;
        newUser.password = hash;
        console.log(newUser);
        newUser.save(function (err, results) {
            if (err)
                throw err;
        });

    });

};

module.exports.updateUsername = function (username, newusername, callback) {
    let query = {username: username};
    User.findOne(query, function (err, user) {
        if (err) throw err;
        user.username = newusername;
        user.save();

    });

};

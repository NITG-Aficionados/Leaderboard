let mongoose = require('mongoose');
let bcrypt = require('bcrypt');
let Profile = require('../models/profile.js');
// mongoose.connect('mongodb://localhost/leaderboard');
// let db=mongoose.connect;

let UserSchema = mongoose.Schema({
    username: {
        type: String,
        index: true,
        unique: true,
        required: true
    },
    password: {
        type: String, required: true, bcrypt: true
    },
    email: {
        type: String,
        required: true
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
        if (err) return callback(err, null);
        newUser.password = hash;
        newUser.save(function (err, results) {
            if (err) return callback(err, null);
            console.log("Results after hashing ::: ", results);
            newUser = results;
        });


    });
    var newProfile = new Profile({
        username: newUser.username,
        name: newUser.name,
        email: newUser.email,
        bio: "Fill It",
        interests: "Fill It",
        cfh: "----",
        tch: "----",
        cch: "----",
        hrh: "----",
        heh: "----",
        cfr: 0,
        tcr: 0,
        ccr: 0,
        hrr: 0,
        her: 0,
        index: 0,
        cr: 200,
        cnr: 200,
        img: "noimage.jpg"
    });

    Profile.createProfile(newProfile, function (err, profile) {
        if (err) throw err;
        console.log("Profile", profile);
    });

    console.log("New USER ------>", newUser);
    return callback(null, newUser);



};

module.exports.updateUsername = function (username, newusername, callback) {
    let query = {username: username};
    User.findOne(query, function (err, user) {
        if (err) throw err;
        user.username = newusername;
        user.save();

    });

};

const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const bcrypt = require('bcrypt');
const url = 'mongodb://localhost:27017';
const Url = require("../models/url")
const dbName = 'fundoo-app';


MongoClient.connect(url, function (err, client) {
    assert.equal(null, err);
    db = client.db(dbName);
    collection = db.collection('users');
});


const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    newtoken: {
        type: String,
        required: false
    },
    imageUrl: {
        type: String,
        default: false
    },
    isEmail: {
        type: Boolean,
        default: false
    },

    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }

});
const User = mongoose.model('user', userSchema);

class UserModel {
    register(body, callback) {
        console.log(body);
        collection.findOne({
            email: body.email
        }, (err, result) => {
            if (err)
                callback(err)
            else if (result)
                callback({
                    message: 'Email already registered'
                })
            else {
                bcrypt.hash(body.password, 10, (err, hash) => {
                    if (err)
                        throw err;

                    const user = new User({
                        firstName: body.firstName,
                        lastName: body.lastName,
                        email: body.email,
                        password: hash
                    })

                    user.save((err, data) => {
                        if (err) {
                            callback(err)
                        } else {
                            console.log(data);
                            callback(null, data);
                        }
                    })
                })
            }
        })
    }
    isEmail(body) {
        console.log(body.email);
        return new Promise(function (resolve, reject) {
            User.updateOne({
                email: body.email
            }, {
                isEmail: "true"
            }).then((data) => {
                console.log("result at model", data);
                resolve(data);

            }).catch((err) => {
                console.log("err at model", err);
                reject(err);
            })
        })
    }
    shorten(body, callback) {
        console.log("model", body);
        console.log(body.longUrl);
        let url = Url.findOne({
            longUrl: body.longUrl
        }, (err, result) => {
            if (result) {
                callback(result);
            } else {
                url = new Url({
                    longUrl: body.longUrl,
                    shortUrl: body.shortUrl,
                    urlCode: body.urlCode,
                    token: body.result,
                    date: new Date()
                });
                url.save();
                if (err) {
                    console.log(err)
                } else {
                    callback(null, url.shortUrl);
                }
            }
        })
    }
    upload(body) {
        console.log(body.url);
        return new Promise((resolve, reject) => {
            User.updateOne({
                    email: body.email
                }, {
                    imageUrl: body.url
                })
                .then((data) => {
                    resolve(data);
                }).catch((err) => {
                    reject(err);
                })
        })
    }
    login(body, callback) {
        console.log("at login", body);
        User.findOne({
            email: body.email
        }, (err, result) => {
            if (err)
                callback(err)
            else if (!result)
                callback({
                    message: "User not found"
                })
            else {
                callback(null, result);
            }
        })
    }
}

module.exports = new UserModel();
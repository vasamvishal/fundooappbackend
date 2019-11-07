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
    forgot_token: {
        type: String,
        default: false
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
        try {
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
        } catch (err) {
            console.log("err at register model", err)
        }
    }
    isEmail(body) {
        try {
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
        } catch (err) {
            console.log("err at isemail model", err)
        }
    }
    shorten(body, callback) {
        try {
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
        } catch (err) {
            console.log("err at shorten model", err)
        }
    }
    upload(body) {
        try {
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
        } catch (err) {
            console.log("err at upload model", err)
        }
    }
    login(body, callback) {
        try {
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
        } catch (err) {
            console.log("err at login model", err)
        }
    }

    forgot(body, callback) {
        try {
            collection.findOne({
                email: body.email
            }, (err, result) => {
                if (err)
                    callback(err);
                else if (result)
                    callback(null, result);
                else
                    callback({
                        message: "User not found"
                    });
            })
        } catch (err) {
            console.log("err at forgot model", err)
        }
    }

    updateToken(body, callback) {
        try {
            console.log(body);
            User.updateOne({
                email: body.email
            }, {
                forgot_token: body.verify_token
            }, (err, result) => {
                if (err)
                    callback(err);
                else if (result) {
                    console.log("updated")
                    callback(null, result);
                }
            })
        } catch (err) {
            console.log("err at updateToken model", err)
        }
    }

    reset(body, callback) {
        try {
            console.log("model data", body);
            User.findOne({
                forgot_token: body.token
            }, (err, result) => {
                if (err)
                    callback(err);
                else if (result) {
                    console.log(result);
                    callback(null, result);
                }
            })
        } catch (err) {
            console.log("err at reset model", err)
        }
    }
    set(body, callback) {
        try {
            console.log(body);
            User.updateOne({
                email: body.email
            }, {
                $set: {
                    password: body.hash
                }
            }, (error, data) => {
                if (error) {
                    console.log("error", error);
                    callback(error);
                } else if (data)
                    callback(null, {
                        message: "Updated successfully"
                    });
            })
        } catch (err) {
            console.log("err at set model", err)
        }
    }
}
module.exports = new UserModel();
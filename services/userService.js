const userModel = require('../models/userModel');
var nodemailer = require('nodemailer');
var mail = require("../util/mail")
var shortid = require('shortid');
var config1 = require("../config/databaseConfig");
var validUrl = require('valid-url');
var redis = require("redis");
var redis1 = require('../services/redisserver');
var bcrypt = require('bcrypt');
var s3Client = require("../aws/file-upload");
require('dotenv').config();
client = redis.createClient();
var bcrypt = require("bcrypt");
class UserService {
    register(body, callback) {
        try {
            userModel.register(body, (err, data) => {
                if (err) {
                    callback(err)
                } else {
                    console.log("service", data);
                    callback(null, data)
                }
            })
        } catch (err) {
            console.log("err at register service", err)
        }
    }
    shorten(req, callback) {
        try {
            console.log("service", req);
            const longUrl = req.email;
            console.log(longUrl);
            const baseUrl = config1.port;
            console.log(baseUrl);
            const result = req.result;
            //Check base url
            if (validUrl.isUri(longUrl)) {
                if (validUrl.isUri(baseUrl)) {
                    const urlCode = shortid.generate();
                    console.log(urlCode);
                    console.log(urlCode);
                    const shortUrl = baseUrl + '/' + urlCode;
                    console.log("shortUrl", shortUrl);
                    var req1 = {
                        urlCode,
                        longUrl,
                        baseUrl,
                        result,
                        shortUrl
                    }
                    userModel.shorten(req1, (err, result) => {
                        if (err) {
                            console.log(err);
                            callback(err);
                        } else {
                            console.log(result);
                            mail.sendLink(result);
                            console.log(result);
                            callback(null, result);
                        }
                    })
                } else {
                    return res.status(401).json('Invalid base url');
                }

            } else {
                return res.status(422).json('invalid long url');
            }
        } catch (err) {
            console.log("err at register service", err)
        }
    }
    upload(req, res) {
        try {
            console.log(req.file.location);
            console.log(req.decoded.email);
            //console.log(req);

            let s3url = s3Client.s3CLient.getSignedUrl('getObject', {
                Bucket: process.env.bucket,
                Key: req.file.originalname
            })
            let uploadData = {
                'email': req.decoded.email,
                'url': s3url
            }
            console.log(uploadData);
            return new Promise((resolve, reject) => {
                var initPromise = userModel.upload(uploadData, res);
                initPromise.then((data) => {
                        resolve(data);
                    })
                    .catch((err) => {
                        reject(err);
                    })
            })

        } catch (err) {
            console.log("err at upload service", err)
        }
    }

    isEmail(object) {
        try {
            return new Promise((resolve, reject) => {
                var initPromise = userModel.isEmail(object);
                initPromise.then((data) => {
                    console.log(data);
                    resolve(data);
                }).catch((err) => {
                    reject(err);
                })

            })
        } catch (err) {
            console.log("err at isemail service", err)
        }
    }


    login(body, callback) {
        try {
            let payload = {
                "email": body.email
            }
            console.log(payload);
            var result = mail.generateToken(payload);
            console.log(result);
            redis1.serviceset(payload, result, (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(result);
                }
            });
            redis1.serviceget(payload, (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(result);
                }
            });


            userModel.login(body, (err, result) => {
                if (err) {
                    callback(err)
                } else {
                    console.log("model at login", result.isEmail);
                    if (result.isEmail == false || result.isEmail == undefined) {
                        callback({
                            message: "cannot login"
                        });
                    } else {
                        bcrypt.compare(body.password, result.password, (err, res) => {
                            if (err)
                                callback(err);
                            else if (res) {
                                console.log("login succesful");
                                callback(null, result);
                            }
                        })
                    }
                }
            });
        } catch (err) {
            console.log("err at login service", err)
        }
    }
    forgot(body, callback) {
        try {
            console.log(body);
            userModel.forgot(body, (err, data) => {
                if (err) {
                    callback(err);
                } else {
                    let payload = {
                            email: data.email
                        },
                        result = mail.generateToken(payload),
                        req = {
                            email: body.email,
                            verify_token: result
                        }
                    userModel.updateToken(req, (err, data) => {
                        console.log(result);
                        let url = 'http://localhost:3000/#!/reset/' + result;
                        mail.sendLink(url, payload);
                        if (err) {
                            console.log(err);
                            callback(err);
                        } else {
                            callback(null, data);
                        }
                    })
                }
            })
        } catch (err) {
            console.log("err at register service", err)
        }
    }
    reset(body, callback) {
        try {
            userModel.reset(body, (err, result) => {
                if (err)
                    callback(err)
                else {
                    bcrypt.compare(body.password_old, result.password, (err, res) => {
                        if (err)
                            callback(err);
                        else if (res) {
                            bcrypt.hash(body.password_new, 10, (err, hash) => {
                                if (err)
                                    throw err;
                                else {
                                    console.log("service", result);
                                    var req = {
                                        email: result.email,
                                        hash: hash
                                    }
                                    console.log("service", req);
                                    userModel.set(req, (err, result) => {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            console.log(result);
                                            callback({
                                                message: "succesfully updated"
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        } catch (err) {
            console.log("err at register service", err)
        }
    }
}

module.exports = new UserService();
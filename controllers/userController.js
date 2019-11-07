require('dotenv').config();
const service = require('../services/userService');
const mail = require('../util/mail');
var redis = require("redis"),
    client = redis.createClient();
class UserController {

    register(req, res) {
        try {
            req.check('email', 'Invalid email').isEmail();
            req.check('password', 'Invalid password').isLength({
                min: 6
            }).isAlphanumeric();
            const errors = req.validationErrors();
            if (errors) {
                return res.status(422).json({
                    errors: errors
                })
            }
            service.register(req.body, (err, data) => {
                if (err) {
                    res.status(422).send(err);
                } else {
                    console.log("register success");
                    console.log("registered data", data);
                    var payload = {
                        email: data.email
                    };
                    var result = mail.generateToken(payload);
                    let email = 'http://localhost:3000/#!/login/' + result;
                    let url = {
                        email,
                        result
                    }
                    console.log(url);
                    service.shorten(url, (err, result) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(result);
                        }
                    })
                    res.status(200).send(data);
                }
            })
        } catch (err) {
            console.log("err at register controller", err);
        }
    }
    uploaddata(req, res) {
        try {
            console.log("req");
            var promise = new Promise((resolve, reject) => {
                service.upload(req, res)
                promise.then((data) => {
                        res.status(200).send(data);
                    })
                    .catch((err) => {
                        res.status(422).send(err);
                    })
            })
        } catch (err) {
            console.log("err at upload data", err);
        }
    }
    async isEmail(req, res) {
        try {
            var promise = await service.isEmail(req.body);
            console.log("controller", promise);
            if (promise) {
                res.status(200).send(promise);
            } else {
                res.status(422).send(err);
            }
        } catch (err) {
            console.log("error at is email controller", err)
        }
    }
    login(req, res) {
        try {
            req.check('email', 'Invalid email').isEmail();
            req.check('password', 'Invalid password').isLength({
                min: 6
            }).isAlphanumeric();
            const errors = req.validationErrors();
            if (errors) {
                return res.status(422).json({
                    errors: errors
                })
            }
            let responseResult = {};
            console.log(req.body);
            let result = {
                email: req.body.email,
                password: req.body.password
            }
            console.log(result);
            service.login(result, (err, data) => {
                if (data) {
                    responseResult.sucess = true;
                    // responseResult.result = result;
                    responseResult.message = "login succesfully";
                    res.status(200).send(responseResult);
                } else {
                    responseResult.sucess = false;
                    responseResult.errors = err;
                    res.status(422).send(responseResult);
                }
            })
        } catch (err) {
            console.log("err at login controller", err);
        }
    }

    forgot(req, res) {
        try {
            req.check('email', 'Invalid email').isEmail();
            const errors = req.validationErrors();
            if (errors)
                return res.status(422).json({
                    errors: errors
                });

            service.forgot(req.body, (err, data) => {
                if (err)
                    res.status(422).send(err);
                else {
                    if (err) {
                        console.log(err);
                    } else {
                        res.status(200).send(data);
                    }
                };
            })
        } catch (err) {
            console.log("err at controller forgot", err)
        }
    }
    reset(req, res) {
        try {
            req.check('password', 'Invalid password').isLength({
                min: 6
            }).isAlphanumeric();
            req.check('password_new', 'Invalid password').isLength({
                min: 6
            }).isAlphanumeric();
            const errors = req.validationErrors();
            if (errors)
                return res.status(422).json({
                    errors: errors
                });
            let result = {
                token: req.headers.headers,
                password_old: req.body.password,
                password_new: req.body.password_new
            }
            console.log(result);
            service.reset(result, (err, data) => {
                if (err) {
                    console.log("error in con 99--", err);
                    res.status(422).send(err);
                } else
                    res.status(200).send(data);
            })
        } catch (err) {
            console.log("err at reset controler", err)
        };
    }
}

module.exports = new UserController();
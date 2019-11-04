const userModel = require('../models/userModel');
var nodemailer = require('nodemailer');
var mail = require("../util/mail")
var shortid = require('shortid');
var config1 = require("../config/databaseConfig");
var validUrl = require('valid-url');
class UserService {
    register(body, callback) {
        userModel.register(body, (err, data) => {
            if (err) {
                callback(err)
            } else {


                console.log("service", data);
                callback(null, data)
            }
        })
    }

    shorten(req, callback) {
        console.log("service", req);
        const longUrl = req.email;
        console.log(longUrl);
        const baseUrl = config1.port;
        console.log(baseUrl);
        const result = req.result;
        //Check base url
        if (validUrl.isUri(baseUrl)) {
            const urlCode = shortid.generate();
            console.log(urlCode);
            //console.log("baseUrl",body.baseUrl);
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
    }


    isEmail(object) {
        return new Promise((resolve, reject) => {

            var initPromise = userModel.isEmail(object);
            initPromise.then((data) => {
                console.log(data);
                resolve(data);

            }).catch((err) => {
                reject(err);
            })

        })
    }

    login(body, callback) {

        userModel.login(body, (err, data) => {
            if (err) {
                callback(err)
            } else {
                callback(null, data);
            }
        })
    }

    // forgot(body, callback) {

    //     userModel.forgot(body, (err, data) => {
    //         if (err) {
    //             callback(err)
    //         } else {
    //             callback(null, data);
    //         }
    //     })
    // }

    // update(body,callback)
    // {
    //     userModel.updateToken(body,(err,data)=>{
    //         if (err) {
    //             callback(err)
    //         } else {

    //             callback(null, data);
    //         }
    //     })
    // }

    // reset(body,callback)
    // {
    //     userModel.reset(body,(err,data)=>{
    //         if (err)             
    //             callback(err)
    //         else
    //             callback(null, data);
    //     })
    // }


    //     getallUsers(body,callback)
    //     {
    //         userModel.getallUsers(body,(err,data)=>
    //         {
    //             if(err)
    //                 callback(err)
    //             else
    //                 callback(null,data)
    //         })
    //     }
}

module.exports = new UserService();
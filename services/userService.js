const userModel = require('../models/userModel');
var nodemailer = require('nodemailer');

class UserService {
    register(body, callback) {
        userModel.create(body, (err, data) => {
            if (err) {
                callback(err)
            } else {
                callback(null, data)
            }
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

    forgot(body, callback) {
        
        userModel.forgot(body, (err, data) => {
            if (err) {
                callback(err)
            } else {
                callback(null, data);
            }
        })
    }

    update(body,callback)
    {
        userModel.updateToken(body,(err,data)=>{
            if (err) {
                callback(err)
            } else {

                callback(null, data);
            }
        })
    }

    reset(body,callback)
    {
        userModel.reset(body,(err,data)=>{
            if (err)             
                callback(err)
            else
                callback(null, data);
        })
    }

    sendLink(url,req)
    {

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
            user: process.env.email_id,
            pass: process.env.password
            } 
        });

        let mailOptions = {
            from: process.env.email_id,
            to: req.email,
            subject: 'Forget password link',
            text: 'Click on the following link to reset.\n'+url
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error)
            console.log(error);
            else
            console.log('Email sent: ' + info.response);
        });
    }

    getallUsers(body,callback)
    {
        userModel.getallUsers(body,(err,data)=>
        {
            if(err)
                callback(err)
            else
                callback(null,data)
        })
    }
}

module.exports = new UserService();

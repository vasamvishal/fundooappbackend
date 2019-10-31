require('dotenv').config();
var nodemailer = require('nodemailer');
let jwt = require('jsonwebtoken');

sendLink = (url,req) =>
{
  //console.log(url);

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.email_id,
      pass: process.env.password
    } 
  });

  let mailOptions = {
    from: process.env.email_id,
    to: 'vasamvishal12@gmail.com',
    subject: 'Forget password link',
    text: 'Click on the following link to reset.\n'+url
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

generateToken = (payload) =>
{
  let token = jwt.sign(payload, 'secret',{ expiresIn: '24h'});
  return token;
}

module.exports={
  sendLink,
  generateToken
}
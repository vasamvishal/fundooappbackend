const express = require('express');
const router = express.Router();
const userControl = require('../controllers/userController');
const service = require('../services/userService')
const auth = require('../auth/auth');
var multer=require("../aws/file-upload")
const tokenverify=require("../auth/token")
router.post('/register', userControl.register);
 router.post('/login',userControl.login);
 router.post('/isemail',auth.checkToken,userControl.isEmail);
 router.post('/forgot',userControl.forgot);
 router.post('/imageupload',tokenverify.Token,multer.upload.single('image'),userControl.uploaddata);
  router.post('/reset',tokenverify.Token,userControl.reset);
// router.get('/dashboard',userControl.getallUsers);
// router.post('/sendMsg',chatControl.sendMsgControl);
// router.get('/getMsg',chatControl.getMsgControl);

module.exports = router;
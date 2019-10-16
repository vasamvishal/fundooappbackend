const express = require('express');
const router = express.Router();
const userControl = require('../controllers/userController');
const chatControl = require('../controllers/chatController')
const auth = require('../auth/auth');

router.post('/register', userControl.register);
router.post('/login', userControl.login);
router.post('/forgot',userControl.forgot);
router.post('/reset',auth.checkToken,userControl.reset);
router.get('/dashboard',userControl.getallUsers);
router.post('/sendMsg',chatControl.sendMsgControl);
router.get('/getMsg',chatControl.getMsgControl);

module.exports = router;
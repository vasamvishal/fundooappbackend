// const express = require('express');
// const router = express.Router();
// const validUrl = require('valid-url');
// const shortid = require('shortid');
// const config = require('config');
// const config1 = require('../config/databaseConfig');
// const Url = require('../models/url');
// const Usercontroller=require("../controllers/userController");
// const service=require("../services/userService");
// // @route     POST /api/url/shorten
// // @desc      Create short URL
//  router.post('/shorten', service.shorten)
//  //async (req, res) => {
   
// //   const { longUrl } = req.body;
// //   const baseUrl = config1.port;
// //   console.log(baseUrl);
// //   //Check base url
// //   if (validUrl.isUri(baseUrl)) {
// //   }
// //   else{
// //     return res.status(401).json('Invalid base url');
// //   }

// //   // Create url code
// //   const urlCode = shortid.generate();

// //   // Check long url
// //   if (validUrl.isUri(longUrl)) {
// //     try {
// //       let url = await Url.findOne({ longUrl });

// //       if (url) {
// //          //  console.log(url);
// //         res.json(url);
// //       } else {
// //           console.log("baseUrl",baseUrl);
// //         const shortUrl = baseUrl + '/' + urlCode;

// //         url = new Url({
// //           longUrl,
// //           shortUrl,
// //           urlCode,
// //           date: new Date()
// //         });

// //         await url.save();

// //         res.json(url);
// //       }
// //     } catch (err) {
// //       console.error(err);
// //       res.status(500).json('Server error');
// //     }
// //   } else {
// //     res.status(401).json('Invalid long url');
// //   }
// // });

// module.exports = router;
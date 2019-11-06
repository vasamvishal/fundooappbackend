require('dotenv').config();
var aws = require('aws-sdk')
var multer = require('multer')
var multerS3 = require('multer-s3')
var s3Client = new aws.S3({
  accessKeyId: process.env.AWSAccessKeyId,
  secretAccessKey: process.env.AWSSecretKey,
});

var upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: 'vishalvasamfile',
    acl: 'public-read',
    metadata: function (req, file, callback) {
      console.log("metadata");
      callback(null, {
        fieldName: "testing-metadata"
      });
    },
    key: function (req, file, callback) {
      console.log(file.originalname)
      callback(null, file.originalname);
    }
  })
})

module.exports = {
  upload: upload,
  s3CLient: s3Client,
};
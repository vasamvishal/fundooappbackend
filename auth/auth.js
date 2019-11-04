var jwt = require('jsonwebtoken');
var request = require("request");
var url = require("../models/url");
checkToken = (req, res, next) => {
    //
    // console.log(req);


    var urlcode = req.headers.headers || req.params.headers;
    console.log(urlcode);

    url.findOne({
        urlCode: urlcode
    }, (err, result) => {
        if (err) {
            console.log("err", err);
        } else {
            console.log("result", result);

              var bearerHeader=result.token;
              console.log(bearerHeader);

            req.authenticated = false;
            if (bearerHeader) {
                jwt.verify(bearerHeader, 'secret', function (err, decoded) {
                    if (err) {
                        console.log(err);
                        req.authenticated = false;
                        req.decoded = null;
                        next();
                    } else {
                        req.decoded = decoded;
                        //  console.log(decoded);
                        req.authenticated = true;
                        next();
                    }
                });
            }
        }
    });
}
module.exports = {
    checkToken
}
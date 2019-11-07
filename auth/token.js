var jwt = require('jsonwebtoken');

Token = (req, next) => {
    var bearerHeader = req.headers.headers || req.params.headers;
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
                console.log(decoded);
                req.authenticated = true;
                next();
            }
        });
    }
}
module.exports = {
    Token
};
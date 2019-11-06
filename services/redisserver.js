const redis = require('redis');
var client = redis.createClient();
class RedisServer {
    serviceset(key, value, callback) {
        console.log(key);
        client.set(key.toString(), value, (err, result) => {
            if (err) {
                callback(err)
            } else {
                console.log("result at redisserver", result);
                callback(null, result);
            }
        })
    }
    serviceget(key, callback) {
        console.log("service get", key);
        client.get(key.toString(), (err, result) => {
            if (err) {
                callback(err)
            }
            console.log("result at redisserver", result, key);
            callback(null, result)
        })
    }
}
module.exports = new RedisServer();
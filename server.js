const express = require('express');
const expressValidator = require('express-validator');
// create express app
const app = express();
const server = require('http').createServer(app);
const bodyParser = require('body-parser');
const cors = require('cors');
const route = require('./routes/routes')
//enables CORS
app.use(cors({
  'allowedHeaders': ['sessionId', 'Content-Type'],
  'exposedHeaders': ['sessionId'],
  'origin': '*',
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'preflightContinue': false
}));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: true
}))

// parse requests of content-type - application/json
app.use(bodyParser.json())
app.use(expressValidator())
app.use(express.static('../frontend'))
app.use('/', route)
app.use('/api', route);
//app.use('/api/url',require("../backend/routes/url"));
const config = require('./config/databaseConfig');
const mongoose = require('mongoose');
const connectDB = async () => {
  try {
    await mongoose.connect(config.url, {
      useNewUrlParser: true
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
connectDB();
var redis = require('redis');
var client = redis.createClient();

client.on('connect', function () {
  console.log('Redis client connected');
});
client.on('error', function (err) {
  console.log('Something went wrong ' + err);
});


server.listen(config.port1, () => {
  console.log("Server is listening on port 3000");
});
module.exports = server
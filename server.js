const express = require('express');
const expressValidator = require('express-validator');
// create express app
const app = express();
const server = require('http').createServer(app);
var io = require('socket.io').listen(server);
const bodyParser = require('body-parser');
const cors = require('cors');
const controller = require('./controllers/chatController');
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
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())
app.use(expressValidator())
app.use(express.static('../client'))

io.on('connection', function(client) 
{
    console.log("User connected");


    client.on('newMsg',(message)=>
    {
        controller.sendMsgControl(message,(err,data)=>
        {        
            if(err) 
                return err   
            else     
                return data 
        }) 
        console.log(message);   
        io.emit(String(message.receiverId),message);
    })
    io.on('disconnect', (client) => {
        console.log("socket disconnected");
    })
})

app.use('/',route)
const config = require('./config/databaseConfig');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// Connecting to the databas
mongoose.connect(config.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

server.listen(config.port, () => {
    console.log("Server is listening on port 3000");
});
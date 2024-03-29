const express = require('express')
const http = require('http')
const socket = require('socket.io')
const cors = require('cors');
const bodyParser = require('body-parser');
var createError = require('http-errors')
let mongoose = require('mongoose');

const port = process.env.PORT || 5000

// setting up database
try {
    db = require('./database/dev').db;
} catch {
    db = require('./database/prod').db;
}

// importing routes
const index = require("./routes/index");

// setting up express app
const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());

// start defining routes
app.use('/', index);

// end defining routes

// in case page route not found show 404 Error
app.use((req, res, next) => {
    next(createError(404));
});
app.use(function (err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
});


// Connecting mongoDB Database
mongoose.Promise = global.Promise;
mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => {
    console.log('Database sucessfully connected!')
},
    error => {
        console.log('Could not connect to database : ' + error)
    }
)

// setting up sockets
const server = http.createServer(app)
require('./sockets').listen(server)

server.listen(port, () => console.log(`Chatapp listening on ${port} port!`))
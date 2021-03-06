const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require("passport");
const passportFunc = require("./passport");
const flash = require("express-flash");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const path = require("path")

const authController = require("./controllers/authController");
const dataController = require("./controllers/dataController");
const webSocketController = require("./controllers/webSocketController");

const app = express();
const PORT = 4000 || process.env.PORT;

// Connect to database
const uri = "mongodb+srv://dthick:VI55F0PYGAu4BFv3@cluster-vjwy9.mongodb.net/cloudpt?retryWrites=true&w=majority";
mongoose.connect(uri, {useUnifiedTopology: true, useNewUrlParser: true}, function(err, db) {
    if (err) { console.log(err); } 
    else { console.log("Connected to database");}
});

app.use(session({
    secret: "TxuYJTpXtoQZuIJiHtgt",
    name: "session",
    resave: true,
    rolling: true,
    saveUninitialized: true,
    //cookie: {maxAge: 1 * 60 * 60 * 1000} // 1 hour of inactivity
}))
app.use(cookieParser());
app.use(bodyParser.json());
app.use(flash());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(
    cors({
      origin: "http://localhost:3000", // Allow to server to accept request from different origin
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true // allow session cookie from browser to pass through
    })
  );
  
passportFunc.initPassport(passport);

app.get('/serviceWorker.js', (req, res)=> {
  res.sendFile('./serviceWorker.js')
});

var server = app.listen(PORT, function() {
  console.log("Server is running on Port: " + PORT);
});

authController(app);
dataController(app);
webSocketController(app, server);

if(app.get('env') === 'production'){
  app.use(express.static(path.resolve(__dirname, 'build')))
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'))
  })
}

module.exports = app;
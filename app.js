const express = require('express')
const path = require('path');
const bodyparser = require('body-parser')
const morgan = require('morgan')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const passport = require('passport');
const session = require('express-session')
const cookieSession = require('cookie-session');
const connectDB = require('./config/db');
const MongoStore = require('connect-mongo')(session)
const User = require('./model/User')


const port = process.env.PORT || 3000;

// load config
// require('dotenv').config()
const app = express();

connectDB()

//Configure Session Storage
 /*app.use(cookieSession({
    name: 'session-name',
    keys: ['key1', 'key2'],
    // store: new MongoStore({ mongooseConnection: mongoose.connection })
  })) */

 app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })) 

//passport config
require('./passport')



app.use(express.json())
app.use(express.urlencoded({ extended: false }));




  //Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('public'))
app.use('/css',express.static(__dirname + 'public/css'))
app.use('/js',express.static(__dirname + 'public/js'))
app.use('/img',express.static(__dirname + 'public/img'))

app.set('view engine', 'ejs')
//set the views directory
app.set('views','./views');


app.get('', (req, res) => {
    const params = { };

    res.render('login', params)
})



app.get('/failed', (req, res) => {
    res.send('<h1>Log in Failed :(</h1>')
  });

  // Middleware - Check user is Logged in
const checkUserLoggedIn = (req, res, next) => {
    req.user ? next(): res.sendStatus(401);
  }

  
app.get('/index', checkUserLoggedIn, (req, res) => {
    const params = { };

    res.render('index', params)
}) 

// Auth Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '' }),
  function(req, res) {
    res.redirect('/index');
  }
);

//Logout
app.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
})


app.listen(port, () => {
    console.log(`Running successfully on ${port}`);
})
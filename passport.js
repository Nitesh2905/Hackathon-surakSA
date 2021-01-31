
require("dotenv").config({ path: './env' });
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./model/User')

passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
passport.deserializeUser(function(user, done) {
    done(null, user);
});
console.log(process.env.GOOGLE_CLIENT_ID);

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
  },
    async (accesToken, refreshToken, profile, cb) => {
    const newUser = {
        googleId: profile.id,
        displayName: profile.displayName,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        image: profile.photos[0].value,
    }

    try {
        let user = await User.findOne({ googleId: profile.id })
        if(user) {
            cb(null, user) //done is the callback funtion
        }else{
            user = await User.create(newUser)
            cb(null, user) 
        }
    } catch (err) {
        console.error(err);
    }
}
    
  
));

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');
require('dotenv').config();

// Google OAuth2 strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/api/auth/google/callback',
    passReqToCallback: true,
},
    async (req, accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ email: profile.emails[0].value });

            if (!user) {
                user = new User({
                    email: profile.emails[0].value,
                    loginMethod: 'google',
                });
                await user.save();
            }

            return done(null, user);
        } catch (err) {
            console.error('Error in Google OAuth strategy:', err);
            return done(err, null);
        }
    }
));

// Facebook OAuth2 strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: 'http://localhost:3000/api/auth/facebook/callback',
    profileFields: ['id', 'emails', 'name'], // request the email and name fields from Facebook
    passReqToCallback: true,
},
    async (req, accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ email: profile.emails[0].value });

            if (!user) {
                user = new User({
                    email: profile.emails[0].value,
                    loginMethod: 'facebook',
                });
                await user.save();
            }

            return done(null, user);
        } catch (err) {
            console.error('Error in Facebook OAuth strategy:', err);
            return done(err, null);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

module.exports = passport;

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');
require('dotenv').config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
},
    async (accessToken, refreshToken, profile, done) => {
        const { id, emails } = profile;
        try {
            let user = await User.findOne({ googleId: id });
            if (!user) {
                user = new User({ googleId: id, email: emails[0].value });
                await user.save();
            }
            done(null, user);
        } catch (err) {
            done(err, false);
        }
    }));

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/auth/facebook/callback",
    profileFields: ['id', 'emails', 'name']
},
    async (accessToken, refreshToken, profile, done) => {
        const { id, emails } = profile;
        try {
            let user = await User.findOne({ facebookId: id });
            if (!user) {
                user = new User({ facebookId: id, email: emails[0].value });
                await user.save();
            }
            done(null, user);
        } catch (err) {
            done(err, false);
        }
    }));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

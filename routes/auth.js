const express = require('express');
const router = express.Router();
const passport = require('passport');
const { register, login } = require('../controllers/authController');
const { googleCallback, facebookCallback } = require('../controllers/socialAuthController');

router.post('/register', register);
router.post('/login', login);

// Google OAuth2 authentication route
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth2 callback route
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    googleCallback
);

// Facebook OAuth2 authentication route
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

// Facebook OAuth2 callback route
router.get('/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    facebookCallback
);

module.exports = router;

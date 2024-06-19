const express = require('express');
const connectDB = require('./config/db');
const passport = require('passport');
const session = require('express-session');
require('./config/passport');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

const app = express();

// Connect to the database
connectDB();

// Init Middleware
app.use(express.json());

// Session middleware configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started at ${PORT}`));

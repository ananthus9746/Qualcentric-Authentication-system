const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Joi = require('joi');
require('dotenv').config();

const register = async (req, res) => {
    // Define schema for input validation
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    });

    // Validate request body against schema
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { email, password } = req.body;

    try {
        // Check if the user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Hash the password before saving it to the database
        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({
            email,
            password: hashedPassword
        });

        // Save the new user to the database
        await user.save();

        // Prepare JWT payload with user ID
        const payload = {
            user: {
                id: user.id
            }
        };

        // Sign the JWT with the secret key and set an expiration time
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5m' }, (err, token) => {
            if (err) throw err;
            // Return the token to the client
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const login = async (req, res) => {
    // Define schema for input validation
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    });

    // Validate request body against schema
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { email, password } = req.body;

    try {
        // Check if the user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Compare provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Prepare JWT payload with user ID
        const payload = {
            user: {
                id: user.id
            }
        };

        // Sign the JWT with the secret key and set an expiration time
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5m' }, (err, token) => {
            if (err) throw err;
            // Return the token to the client
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

module.exports = { register, login };

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    },
    loginMethod: {
        type: String,
        enum: ['google', 'facebook'],
        required: true,
    },

});

module.exports = mongoose.model('User', UserSchema);

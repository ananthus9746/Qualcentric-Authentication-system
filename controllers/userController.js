const User = require('../models/User');

const getMe = async (req, res) => {
    try {
        // Find the user by ID and exclude the password field
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

module.exports = { getMe };

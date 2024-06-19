exports.googleCallback = (req, res) => {
    console.log("Google callback", req.user);
    res.redirect('/');
    // Redirect to a specific page after successful authentication
};

exports.facebookCallback = (req, res) => {
    console.log("Facebook callback", req.user);
    res.redirect('/');
    // Redirect to a specific page after successful authentication
};
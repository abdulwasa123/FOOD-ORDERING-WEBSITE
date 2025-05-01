// this middleware makes the my posts page have authorization to delete and edit/update posts 
// it also makes the homepage able use the user.username 

const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        res.locals.user = null; // Not logged in, just continue
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const foundUser = await User.findById(decoded.id);
        res.locals.user = foundUser;
        req.user = foundUser;
    } catch (err) {
        res.locals.user = null; // Invalid token
    }

    next(); // Always continue
};

module.exports = authMiddleware;
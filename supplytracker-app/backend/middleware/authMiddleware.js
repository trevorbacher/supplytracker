const asyncHandler = require('express-async-handler');
const User = require('../models/userModel'); // Correct the capitalization here
const jwt = require('jsonwebtoken');

// Middleware to protect routes
const protect = asyncHandler(async (req, res, next) => {
    try {
        // Retrieve token from cookies
        const token = req.cookies.token;

        // Check if token is valid
        if (!token) {
            res.status(401); // Unauthorized
            throw new Error('Not authorized. Please login');
        }

        // Verify the token using JWT secret
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find the user associated with the token
        const user = await User.findById(verified.id).select('-password');

        // Check if user exists
        if (!user) {
            res.status(401); // Unauthorized
            throw new Error('User not found');
        }
        
        // Attach user information to the request object
        req.user = user;
        next(); // Proceed to the next middleware or route handler

    } catch (error) {
        res.status(401); // Unauthorized
        throw new Error('Not authorized. Please login');
    }
});

module.exports = { protect };
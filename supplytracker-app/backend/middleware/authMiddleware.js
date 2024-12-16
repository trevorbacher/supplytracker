const asyncHandler = require("express-async-handler");
const User = require("../models/userModel"); // Correct the capitalization here
const jwt = require("jsonwebtoken");

const protect = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            res.status(401);
            throw new Error("Not authorized. Please login");
        }

        // Verify token
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findById(verified.id).select("-password"); // Ensure this uses the correct capitalization

        if (!user) {
            res.status(401);
            throw new Error("User not found");
        }
        
        req.user = user; // Attach user to the request object
        next();

    } catch (error) {
        res.status(401);
        throw new Error("Not authorized. Please login");
    }
});

module.exports = { protect };

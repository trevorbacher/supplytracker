const asyncHandler = require("express-async-handler");
const User = require("../models/userModel"); 
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, photo, phone, bio } = req.body;

    // Validate user info
    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please fill in all required fields");
    }

    const userEmailAlreadyExists = await User.findOne({ email }); 
    if (userEmailAlreadyExists) {
        res.status(400);
        throw new Error("Email has already been registered");
    }

    if (phone) {
        const userPhoneAlreadyExists = await User.findOne({ phone }); 
        if (userPhoneAlreadyExists) {
            res.status(400);
            throw new Error("Phone number has already been registered");
        }
    }

    if (password.length < 8) {
        res.status(400);
        throw new Error("Password must be 8 characters or longer");
    }

    if (phone) {
        if (phone.length < 10 || phone.length > 10) {
            res.status(400);
            throw new Error("Phone number must be 10 numbers long");
        }
    }

    // Create new user
    const newUser = await User.create({ 
        name,
        email,
        password,
        photo,
        phone,
        bio,
    });

    // Generate token
    const token = generateToken(newUser._id);

    // Send HTTP-only cookie
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), // expires in one day
        sameSite: "none",
        secure: true,
    });

    if (newUser) {
        const { _id, name, email, photo, phone, bio } = newUser;
        res.status(201).json({
            _id,
            name,
            email,
            photo,
            phone,
            bio,
            token,
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validate request
    if (!email || !password) {
        res.status(400);
        throw new Error("Please fill in all required fields");
    }

    // Check if user exists
    const existingUser = await User.findOne({ email }); 
    
    if (!existingUser) {
        res.status(400);
        throw new Error("User not found");
    }

    // Check if password is correct
    const passwordIsCorrect = await bcrypt.compare(password, existingUser.password);

    if (existingUser && passwordIsCorrect) {

        // Generate token
        const token = generateToken(existingUser._id);

        // Send HTTP-only cookie
        res.cookie("token", token, {
            path: "/",
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 86400), // expires in one day
            sameSite: "none",
            secure: true,
        });

        const { _id, name, email, photo, phone, bio } = existingUser;
        res.status(200).json({
            _id,
            name,
            email,
            photo,
            phone,
            bio,
            token,
        });
    } else {
        res.status(400);
        throw new Error("Invalid email or password");
    }

});

const logoutUser = asyncHandler(async (req, res) => {
    res.cookie("token", "", {
        path: "/",
        httpOnly: true,
        expires: new Date(0), // Set the cookie to expire immediately
        sameSite: "none",
        secure: true,
    });

    // Send response
    res.status(200).json({ message: "User logged out successfully" });
});

const getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        const { _id, name, email, photo, phone, bio } = user;
        res.status(200).json({
            _id,
            name,
            email,
            photo,
            phone,
            bio,
        });
    } else {
        res.status(400);
        throw new Error("User not found");
    }
});

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUser,
};

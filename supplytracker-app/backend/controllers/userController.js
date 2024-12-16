const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const registerUser = asyncHandler ( async (req, res) => {
    const {name, email, password, photo, phone, bio} = req.body;

    // Validate user info
    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please fill in all required fields");
    }

    const userEmailAlreadyExists = await User.findOne({email});
    if (userEmailAlreadyExists) {
        res.status(400);
        throw new Error("Email has already been registered");
    }

    const userPhoneAlreadyExists = await User.findOne({phone});
    if (userPhoneAlreadyExists) {
        res.status(400);
        throw new Error("Phone number has already been registered");
    }

    if (password.length < 8) {
        res.status(400);
        throw new Error("Password must 8 characters or longer");
    }

    if (phone.length < 10 || phone.length > 10) {
        res.status(400);
        throw new Error("Phone number must be 10 numbers long");
    }

    // Create new user
    const user = await User.create({
        name,
        email,
        password,
        photo,
        phone,
        bio
    })

    if (user) {
        const {_id, name, email, photo, phone, bio } = user
        res.status(201).json({
            _id,
            name,
            email,
            photo,
            phone,
            bio
        })
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
});

module.exports = {
    registerUser,
};
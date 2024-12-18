const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Token = require("../models/tokenModel");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

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

const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        res.status(400);
        throw new Error("User not found");
    }

    // Require current password for any update
    const { currentPassword } = req.body;

    if (!currentPassword) {
        res.status(400);
        throw new Error("Current password is required for updates");
    }

    // Verify the current password
    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordCorrect) {
        res.status(400);
        throw new Error("Current password is incorrect");
    }

    // Update fields
    const { name, email, photo, phone, bio } = user;
    user.name = req.body.name || name;
    user.email = req.body.email || email;
    user.photo = req.body.photo || photo;
    user.phone = req.body.phone || phone;
    user.bio = req.body.bio || bio;

    // Handle password update if requested
    if (req.body.newPassword) {
        const { newPassword } = req.body;

        // Validate new password
        if (newPassword.length < 8) {
            res.status(400);
            throw new Error("New password must be at least 8 characters long");
        }

        // Set the new password directly
        user.password = newPassword; // Let the pre-save hook hash the password
    }

    const updatedUser = await user.save();

    res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        photo: updatedUser.photo,
        phone: updatedUser.phone,
        bio: updatedUser.bio,
        password: updatedUser.password,
    });
});

const loginUser = asyncHandler(async (req, res) => {
    const token = req.cookies.token;

    // Check if the user is already logged in (token exists and is valid)
    if (token) {
        try {
            const verified = jwt.verify(token, process.env.JWT_SECRET);
            if (verified) {
                return res.status(200).json({
                    success: true,
                    message: "User is already logged in",
                });
            }
        } catch (error) {
            // Token is invalid, proceed with login
            console.error("Token verification error:", error);
        }
    }

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
    const token = req.cookies.token;

    // Check if the user is logged in (token exists)
    if (!token) {
        res.status(401); // Unauthorized
        throw new Error("User is not logged in");
    }

    // Clear the cookie
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
        const { _id, name, email, photo, phone, bio, password } = user;
        res.status(200).json({
            _id,
            name,
            email,
            photo,
            phone,
            bio,
            password,
        });
    } else {
        res.status(400);
        throw new Error("User not found");
    }
});

const loginStatus = asyncHandler(async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json(false);
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (verified) {
        return res.json(true);
    }
});

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(200).json({
            success: false,
            message: "Please provide an email.",
        });
    }

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(200).json({
            success: true,
            message: "If the email is registered to an account, a password reset link will be sent shortly.",
        });
    }

    // Delete token if it exists in DB
    let token = await Token.findOne({ userId: user._id });
    if (token) {
        await token.deleteOne();
    }

    // Create reset token
    let resetToken = crypto.randomBytes(32).toString("hex") + user._id;

    // Hash token before saving to database
    const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    // Save token to database
    await new Token({
        userId: user._id,
        token: hashedToken,
        createdAt: Date.now(),
        expiresAt: Date.now() + (30 * 60 * 1000) // Thirty minutes
    }).save();

    const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

    // Reset email
    const message = `
        <h2>Hello ${user.name},</h2>
        <p>Please use the url below to reset your password</p>  
        <p>This reset link is valid for only 30 minutes.</p>
        <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
        <p>Regards,</p>
        <p>Trevor</p>
    `;

    const subject = "SupplyTracker Password Reset Request";
    const send_to = user.email;
    const sent_from = process.env.EMAIL_USER;

    try {
        await sendEmail(subject, message, send_to, sent_from);
        return res.status(200).json({
            success: true,
            message: "If the email is registered to an account, a password reset link will be sent shortly."
        });
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({
            success: false,
            message: "Email not sent, please try again."
        });
    }
});

module.exports = {
    registerUser,
    updateUser,
    loginUser,
    logoutUser,
    getUser,
    loginStatus,
    forgotPassword,
    //resetPassword,
};

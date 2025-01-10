const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Token = require('../models/tokenModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// Generate a JSON web token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Register a new user
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, photo, phone, bio } = req.body;

    // Check if user filled both required fields
    if (!email || !password) {
        res.status(400);
        throw new Error('Please fill in all required fields');
    }

    // Check if email already exists
    const userEmailAlreadyExists = await User.findOne({ email });
    if (userEmailAlreadyExists) {
        res.status(400);
        throw new Error('Email has already been registered');
    }

    // Check if phone number already exists
    if (phone) {
        const userPhoneAlreadyExists = await User.findOne({ phone });
        if (userPhoneAlreadyExists) {
            res.status(400);
            throw new Error('Phone number has already been registered');
        }
    }

    // Validate password length
    if (password.length < 8) {
        res.status(400);
        throw new Error('Password must be 8 characters or longer');
    }

    // Validate phone number length
    if (phone) {
        if (phone.length < 10 || phone.length > 10) {
            res.status(400);
            throw new Error('Phone number must be 10 numbers long');
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

    // Generate token for the new user
    const token = generateToken(newUser._id);

    // Send HTTP-only cookie with the token
    res.cookie('token', token, {
        path: '/',
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), // Expires in one day
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production', // Only use secure in production
        domain: process.env.NODE_ENV === 'production' ? 'supplytracker.vercel.app' : 'localhost'
    });

    // Respond with user data and token
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
        throw new Error('Invalid user data');
    }
});

// Update user information
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    // Check if user exists
    if (!user) {
        res.status(400);
        throw new Error('User not found');
    }

    // Require current password for any update
    const { currentPassword } = req.body;

    if (!currentPassword) {
        res.status(400);
        throw new Error('Current password is required for updates');
    }

    // Verify the current password
    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordCorrect) {
        res.status(400);
        throw new Error('Current password is incorrect');
    }

    // Update user fields
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
            throw new Error('New password must be at least 8 characters long');
        }

        // Set the new password directly
        user.password = newPassword; // Let the pre-save hook hash the password
    }

    // Save updated user information
    const updatedUser = await user.save();

    // Respond with updated user data
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

// Login user
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    
    // Validate request
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Please fill in all required fields'
        });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
        return res.status(400).json({
            success: false,
            message: 'User not found'
        });
    }

    // Check if password is correct
    const passwordIsCorrect = await bcrypt.compare(password, existingUser.password);

    if (existingUser && passwordIsCorrect) {
        // Generate token
        const token = generateToken(existingUser._id);

        // Send HTTP-only cookie with the token
        res.cookie('token', token, {
            path: '/',
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 86400),
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production', // Only use secure in production
        });

        // Respond with user data and token
        const { _id, name, email, photo, phone, bio } = existingUser;
        return res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                _id,
                name,
                email,
                photo,
                phone,
                bio,
                token,
            }
        });
    } else {
        return res.status(400).json({
            success: false,
            message: 'Invalid email or password'
        });
    }
});

// Logout user
const logoutUser = asyncHandler(async (req, res) => {
    const token = req.cookies.token;

    // Check if the user is logged in (token exists)
    if (!token) {
        res.status(401); // Unauthorized
        throw new Error('User is not logged in');
    }

    // Clear the cookie
    res.cookie('token', '', {
        path: '/',
        httpOnly: true,
        expires: new Date(0), // Set the cookie to expire immediately
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production', // Only use secure in production
    });

    // Send response
    res.status(200).json({ message: 'User logged out successfully' });
});

// Get user information
const getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    // Respond with user data
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
        throw new Error('User not found');
    }
});

// Check login status
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

// Handle forgot password request
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: 'Please provide an email.',
        });
    }

    const user = await User.findOne({ email });

    // If user does not exist, respond with a success message anyway for security
    if (!user) {
        return res.status(200).json({
            success: true,
            message: 'If the email is registered to an account, a password reset link will be sent shortly.',
        });
    }

    // Delete token if it exists in the database
    let token = await Token.findOne({ userId: user._id });
    if (token) {
        await token.deleteOne();
    }

    // Create reset token
    let resetToken = crypto.randomBytes(32).toString('hex') + user._id;

    // Hash token before saving to database
    const hashedToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Save token to database
    await new Token({
        userId: user._id,
        token: hashedToken,
        createdAt: Date.now(),
        expiresAt: Date.now() + (30 * 60 * 1000) // Thirty minutes
    }).save();

    const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

    // Reset email message
    const message = `
        <h2>Hello ${user.name},</h2>
        <p>Please use the url below to reset your password</p>  
        <p>This reset link is valid for only 30 minutes.</p>
        <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
        <p>Regards,</p>
        <p>Trevor</p>
    `;

    const subject = 'SupplyTracker Password Reset Request';
    const send_to = user.email;
    const sent_from = process.env.EMAIL_USER;

    try {
        // Send reset email
        await sendEmail(subject, message, send_to, sent_from);
        return res.status(200).json({
            success: true,
            message: 'If the email is registered to an account, a password reset link will be sent shortly.'
        });
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({
            success: false,
            message: 'Email not sent, please try again.'
        });
    }
});

// Reset user password
const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { resetToken } = req.params;

    // Hash token then compare to token in database
    const hashedToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    
    // Find token in database
    const userToken = await Token.findOne({
        token: hashedToken,
        expiresAt: {$gt: Date.now()},
    });

    // Check if token is valid
    if (!userToken) {
        res.status(404);
        throw new Error('Invalid or expired token');
    }
    
    // Find user and update password
    const user = await User.findOne({ _id: userToken.userId });
    user.password = password;
    await user.save();
    res.status(200).json({
        message: 'Password reset successful. Please login.'
    });
});

module.exports = {
    registerUser,
    updateUser,
    loginUser,
    logoutUser,
    getUser,
    loginStatus,
    forgotPassword,
    resetPassword,
};
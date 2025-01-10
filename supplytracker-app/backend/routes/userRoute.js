// userRoute.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const { 
    registerUser, 
    updateUser,
    loginUser, 
    logoutUser, 
    getUser,
    loginStatus,
    forgotPassword,
    resetPassword,
} = require('../controllers/userController');

// Health check route for debugging
router.get('/auth-health', (req, res) => {
    res.json({ 
        status: 'active',
        cookies: req.cookies,
        headers: req.headers
    });
});

// Authentication routes
router.post('/register', registerUser);
router.patch('/updateuser', protect, updateUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.get('/user', protect, getUser);
router.get('/loggedin', loginStatus);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resetToken', resetPassword);

// Pre-flight OPTIONS handling for complex routes
router.options('*', (req, res) => {
    res.status(200).end();
});

module.exports = router;
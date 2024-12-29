const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const { registerUser, 
        updateUser,
        loginUser, 
        logoutUser, 
        getUser,
        loginStatus,
        forgotPassword,
        resetPassword,
} = require('../controllers/userController');

router.post('/register', registerUser);
router.patch('/updateuser', protect, updateUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.get('/getuser', protect, getUser);
router.get('/loggedin', loginStatus);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resetToken', resetPassword);

module.exports = router;
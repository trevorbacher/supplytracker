const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const { registerUser, 
        updateUser,
        loginUser, 
        loginStatus,
        logoutUser, 
        getUser,
} = require("../controllers/userController");

router.post("/register", registerUser);
router.patch("/updateuser", protect, updateUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/getuser", protect, getUser);
router.get("/loggedin", loginStatus);

module.exports = router;
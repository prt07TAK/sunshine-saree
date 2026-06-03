const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile, logout } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', verifyToken, getMe);
router.post('/logout', verifyToken, logout);
router.put('/update-profile', verifyToken, updateProfile);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getAllUsers, getUser, deleteUser, getUserStats } = require('../controllers/userController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/stats', verifyToken, isAdmin, getUserStats);
router.get('/', verifyToken, isAdmin, getAllUsers);
router.get('/:id', verifyToken, isAdmin, getUser);
router.delete('/:id', verifyToken, isAdmin, deleteUser);

module.exports = router;

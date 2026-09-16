const express = require('express');
const router = express.Router();
const { signup, login, updatePassword, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/signup', signup);
router.post('/login', login);
router.put('/update-password', protect, updatePassword);
router.get('/me', protect, getMe);

module.exports = router;

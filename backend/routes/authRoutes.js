const express = require('express');
const router = express.Router();
const { register, login, getMe, forgotPassword, refreshToken, changePassword } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/refresh', refreshToken);
router.get('/me', protect, getMe);
router.put('/change-password', protect, changePassword);

module.exports = router;

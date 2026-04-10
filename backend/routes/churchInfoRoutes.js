const express = require('express');
const router = express.Router();
const { getChurchInfo, updateChurchInfo } = require('../controllers/churchInfoController');
const { protect } = require('../middlewares/authMiddleware');

// Get info is public (might be used in login or public sites)
router.get('/', getChurchInfo);

// Update info requires authentication (admin typically, though 'protect' handles base auth)
router.put('/', protect, updateChurchInfo);

module.exports = router;

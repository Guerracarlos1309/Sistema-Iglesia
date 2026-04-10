const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

router.use(protect);
router.use(restrictTo('admin'));

router.get('/stats', reportController.getStats);
router.get('/finance', reportController.getFinancialReport);

module.exports = router;

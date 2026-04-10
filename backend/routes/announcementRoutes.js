const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

// Public to all authenticated users
router.get('/', protect, announcementController.getAll);

// Admin only actions
router.get('/admin', protect, restrictTo('admin'), announcementController.getAdminList);
router.post('/', protect, restrictTo('admin'), announcementController.create);
router.put('/:id', protect, restrictTo('admin'), announcementController.update);
router.delete('/:id', protect, restrictTo('admin'), announcementController.delete);

module.exports = router;

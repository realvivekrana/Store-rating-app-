const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { listStoresForUser, submitRating } = require('../controllers/storeController');

router.get('/', protect, authorize('user'), listStoresForUser);
router.post('/:id/rating', protect, authorize('user'), submitRating);

module.exports = router;

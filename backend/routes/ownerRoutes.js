const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getOwnerDashboard } = require('../controllers/ownerController');

router.get('/dashboard', protect, authorize('owner'), getOwnerDashboard);

module.exports = router;

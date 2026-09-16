const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getDashboard,
  createUser,
  listUsers,
  getUserDetail,
  createStore,
  listStores,
} = require('../controllers/adminController');

router.use(protect, authorize('admin')); // every route below requires an admin

router.get('/dashboard', getDashboard);

router.post('/users', createUser);
router.get('/users', listUsers);
router.get('/users/:id', getUserDetail);

router.post('/stores', createStore);
router.get('/stores', listStores);

module.exports = router;

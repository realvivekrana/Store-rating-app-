const User = require('../models/User');
const Store = require('../models/Store');
const Rating = require('../models/Rating');
const { validateUserFields, validateEmail, validateName, validateAddress } = require('../utils/validators');

// GET /api/admin/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      User.countDocuments(),
      Store.countDocuments(),
      Rating.countDocuments(),
    ]);
    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load dashboard', error: err.message });
  }
};

// POST /api/admin/users  (Admin can create normal users, admins, or store owners)
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;
    const { valid, errors } = validateUserFields({ name, email, password, address });
    if (!valid) return res.status(400).json({ errors });

    const allowedRoles = ['admin', 'user', 'owner'];
    const finalRole = allowedRoles.includes(role) ? role : 'user';

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ message: 'Email is already registered' });

    const user = await User.create({ name, email, password, address, role: finalRole });
    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email, address: user.address, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create user', error: err.message });
  }
};

// GET /api/admin/users?name=&email=&address=&role=&sortBy=&order=
exports.listUsers = async (req, res) => {
  try {
    const { name, email, address, role, sortBy = 'createdAt', order = 'asc' } = req.query;
    const filter = {};
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (email) filter.email = { $regex: email, $options: 'i' };
    if (address) filter.address = { $regex: address, $options: 'i' };
    if (role) filter.role = role;

    const allowedSort = ['name', 'email', 'address', 'role', 'createdAt'];
    const sortField = allowedSort.includes(sortBy) ? sortBy : 'createdAt';
    const sortDir = order === 'desc' ? -1 : 1;

    const users = await User.find(filter).sort({ [sortField]: sortDir });

    // If any listed user is a store owner, attach their store's average rating.
    const ownerIds = users.filter((u) => u.role === 'owner').map((u) => u._id);
    const stores = await Store.find({ owner: { $in: ownerIds } });
    const storeIdToOwner = {};
    stores.forEach((s) => {
      storeIdToOwner[s._id.toString()] = s.owner.toString();
    });
    const ratingAgg = await Rating.aggregate([
      { $match: { store: { $in: stores.map((s) => s._id) } } },
      { $group: { _id: '$store', avg: { $avg: '$rating' } } },
    ]);
    const ownerIdToAvg = {};
    ratingAgg.forEach((r) => {
      const ownerId = storeIdToOwner[r._id.toString()];
      if (ownerId) ownerIdToAvg[ownerId] = Math.round(r.avg * 10) / 10;
    });

    const result = users.map((u) => ({
      id: u._id,
      name: u.name,
      email: u.email,
      address: u.address,
      role: u.role,
      rating: u.role === 'owner' ? ownerIdToAvg[u._id.toString()] || null : undefined,
    }));

    res.json({ users: result });
  } catch (err) {
    res.status(500).json({ message: 'Failed to list users', error: err.message });
  }
};

// GET /api/admin/users/:id
exports.getUserDetail = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    let rating = null;
    if (user.role === 'owner') {
      const store = await Store.findOne({ owner: user._id });
      if (store) {
        const agg = await Rating.aggregate([
          { $match: { store: store._id } },
          { $group: { _id: '$store', avg: { $avg: '$rating' } } },
        ]);
        rating = agg.length ? Math.round(agg[0].avg * 10) / 10 : null;
      }
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
        rating,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load user', error: err.message });
  }
};

// POST /api/admin/stores
exports.createStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;

    const errors = {};
    const nameErr = validateName(name);
    if (nameErr) errors.name = nameErr;
    const emailErr = validateEmail(email);
    if (emailErr) errors.email = emailErr;
    const addrErr = validateAddress(address);
    if (addrErr) errors.address = addrErr;
    if (Object.keys(errors).length) return res.status(400).json({ errors });

    const existing = await Store.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ message: 'A store with this email already exists' });

    let owner = null;
    if (ownerId) {
      const ownerUser = await User.findById(ownerId);
      if (!ownerUser || ownerUser.role !== 'owner') {
        return res.status(400).json({ message: 'ownerId must reference a user with role "owner"' });
      }
      owner = ownerUser._id;
    }

    const store = await Store.create({ name, email, address, owner });
    res.status(201).json({ store });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create store', error: err.message });
  }
};

// GET /api/admin/stores?name=&email=&address=&sortBy=&order=
exports.listStores = async (req, res) => {
  try {
    const { name, email, address, sortBy = 'createdAt', order = 'asc' } = req.query;
    const filter = {};
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (email) filter.email = { $regex: email, $options: 'i' };
    if (address) filter.address = { $regex: address, $options: 'i' };

    const allowedSort = ['name', 'email', 'address', 'createdAt'];
    const sortField = allowedSort.includes(sortBy) ? sortBy : 'createdAt';
    const sortDir = order === 'desc' ? -1 : 1;

    const stores = await Store.find(filter).sort({ [sortField]: sortDir });

    const agg = await Rating.aggregate([
      { $match: { store: { $in: stores.map((s) => s._id) } } },
      { $group: { _id: '$store', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    const avgMap = {};
    agg.forEach((a) => {
      avgMap[a._id.toString()] = { avg: Math.round(a.avg * 10) / 10, count: a.count };
    });

    const result = stores.map((s) => ({
      id: s._id,
      name: s.name,
      email: s.email,
      address: s.address,
      rating: avgMap[s._id.toString()]?.avg || null,
      ratingCount: avgMap[s._id.toString()]?.count || 0,
    }));

    res.json({ stores: result });
  } catch (err) {
    res.status(500).json({ message: 'Failed to list stores', error: err.message });
  }
};

const Store = require('../models/Store');
const Rating = require('../models/Rating');
const { validateRating } = require('../utils/validators');

// GET /api/stores?name=&address=&sortBy=&order=   (Normal User store listing)
exports.listStoresForUser = async (req, res) => {
  try {
    const { name, address, sortBy = 'name', order = 'asc' } = req.query;
    const filter = {};
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (address) filter.address = { $regex: address, $options: 'i' };

    const allowedSort = ['name', 'address', 'createdAt'];
    const sortField = allowedSort.includes(sortBy) ? sortBy : 'name';
    const sortDir = order === 'desc' ? -1 : 1;

    const stores = await Store.find(filter).sort({ [sortField]: sortDir });

    const storeIds = stores.map((s) => s._id);
    const agg = await Rating.aggregate([
      { $match: { store: { $in: storeIds } } },
      { $group: { _id: '$store', avg: { $avg: '$rating' } } },
    ]);
    const avgMap = {};
    agg.forEach((a) => {
      avgMap[a._id.toString()] = Math.round(a.avg * 10) / 10;
    });

    const myRatings = await Rating.find({ user: req.user._id, store: { $in: storeIds } });
    const myRatingMap = {};
    myRatings.forEach((r) => {
      myRatingMap[r.store.toString()] = r.rating;
    });

    const result = stores.map((s) => ({
      id: s._id,
      name: s.name,
      address: s.address,
      overallRating: avgMap[s._id.toString()] || null,
      userRating: myRatingMap[s._id.toString()] || null,
    }));

    res.json({ stores: result });
  } catch (err) {
    res.status(500).json({ message: 'Failed to list stores', error: err.message });
  }
};

// POST /api/stores/:id/rating   (create or update — upsert — a rating)
exports.submitRating = async (req, res) => {
  try {
    const { rating } = req.body;
    const err = validateRating(rating);
    if (err) return res.status(400).json({ message: err });

    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ message: 'Store not found' });

    const saved = await Rating.findOneAndUpdate(
      { user: req.user._id, store: store._id },
      { rating: Number(rating) },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json({ rating: saved.rating, message: 'Rating saved successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit rating', error: err.message });
  }
};

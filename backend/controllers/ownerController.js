const Store = require('../models/Store');
const Rating = require('../models/Rating');

// GET /api/owner/dashboard  (Store Owner's own store: avg rating + list of raters)
exports.getOwnerDashboard = async (req, res) => {
  try {
    const store = await Store.findOne({ owner: req.user._id });
    if (!store) {
      return res.status(404).json({ message: 'No store is linked to this owner account yet' });
    }

    const ratings = await Rating.find({ store: store._id }).populate('user', 'name email address');

    const avg = ratings.length
      ? Math.round((ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length) * 10) / 10
      : null;

    res.json({
      store: { id: store._id, name: store.name, email: store.email, address: store.address },
      averageRating: avg,
      totalRatings: ratings.length,
      raters: ratings.map((r) => ({
        userId: r.user._id,
        name: r.user.name,
        email: r.user.email,
        rating: r.rating,
        ratedAt: r.updatedAt,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load owner dashboard', error: err.message });
  }
};

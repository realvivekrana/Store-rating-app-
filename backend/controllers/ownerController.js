const Store = require('../models/Store');
const Rating = require('../models/Rating');

// GET /api/owner/dashboard
exports.getOwnerDashboard = async (req, res) => {
  try {
    const store = await Store.findOne({
      owner: req.user._id,
    });

    if (!store) {
      return res.status(404).json({
        message:
          'No store is linked to this owner account yet',
      });
    }

    const ratings = await Rating.find({
      store: store._id,
    }).populate(
      'user',
      'name email address'
    );

    // Ignore ratings whose user was deleted
    const validRatings = ratings.filter(
      (rating) => rating.user
    );

    let averageRating = null;

    if (validRatings.length > 0) {
      const total = validRatings.reduce(
        (sum, rating) => sum + rating.rating,
        0
      );

      averageRating =
        Math.round(
          (total / validRatings.length) * 10
        ) / 10;
    }

    const raters = validRatings.map((rating) => ({
      userId: rating.user._id,
      name: rating.user.name,
      email: rating.user.email,
      address: rating.user.address,
      rating: rating.rating,
      ratedAt:
        rating.updatedAt || rating.createdAt,
    }));

    return res.json({
      store: {
        id: store._id,
        name: store.name,
        email: store.email,
        address: store.address,
      },

      averageRating,

      totalRatings: validRatings.length,

      raters,
    });
  } catch (err) {
    console.error(
      'Owner dashboard error:',
      err
    );

    return res.status(500).json({
      message: 'Failed to load owner dashboard',
      error: err.message,
    });
  }
};
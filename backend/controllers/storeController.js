const mongoose = require('mongoose');

const Store = require('../models/Store');
const Rating = require('../models/Rating');

const {
  validateRating,
  escapeRegex,
} = require('../utils/validators');

// GET /api/stores
exports.listStoresForUser = async (req, res) => {
  try {
    const {
      name,
      address,
      sortBy = 'name',
      order = 'asc',
    } = req.query;

    const filter = {};

    if (name && name.trim()) {
      filter.name = {
        $regex: escapeRegex(name.trim()),
        $options: 'i',
      };
    }

    if (address && address.trim()) {
      filter.address = {
        $regex: escapeRegex(address.trim()),
        $options: 'i',
      };
    }

    const allowedSortFields = [
      'name',
      'address',
      'createdAt',
    ];

    const sortField =
      allowedSortFields.includes(sortBy)
        ? sortBy
        : 'name';

    const sortDirection =
      order === 'desc' ? -1 : 1;

    const stores = await Store.find(filter).sort({
      [sortField]: sortDirection,
    });

    if (stores.length === 0) {
      return res.json({
        stores: [],
      });
    }

    const storeIds = stores.map(
      (store) => store._id
    );

    // Overall ratings
    const ratingAggregation =
      await Rating.aggregate([
        {
          $match: {
            store: {
              $in: storeIds,
            },
          },
        },
        {
          $group: {
            _id: '$store',
            average: {
              $avg: '$rating',
            },
          },
        },
      ]);

    const averageRatingMap = {};

    ratingAggregation.forEach((item) => {
      averageRatingMap[
        item._id.toString()
      ] =
        Math.round(item.average * 10) / 10;
    });

    // Current user's ratings
    const myRatings = await Rating.find({
      user: req.user._id,
      store: {
        $in: storeIds,
      },
    });

    const myRatingMap = {};

    myRatings.forEach((rating) => {
      myRatingMap[
        rating.store.toString()
      ] = rating.rating;
    });

    const result = stores.map((store) => {
      const storeId =
        store._id.toString();

      return {
        id: store._id,
        name: store.name,
        address: store.address,

        overallRating:
          averageRatingMap[storeId] ??
          null,

        userRating:
          myRatingMap[storeId] ??
          null,
      };
    });

    return res.json({
      stores: result,
    });
  } catch (err) {
    console.error(
      'List stores error:',
      err
    );

    return res.status(500).json({
      message: 'Failed to list stores',
      error: err.message,
    });
  }
};

// POST /api/stores/:id/rating
exports.submitRating = async (req, res) => {
  try {
    const { rating } = req.body;

    const validationError =
      validateRating(rating);

    if (validationError) {
      return res.status(400).json({
        message: validationError,
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.id
      )
    ) {
      return res.status(400).json({
        message: 'Invalid store id',
      });
    }

    const store = await Store.findById(
      req.params.id
    );

    if (!store) {
      return res.status(404).json({
        message: 'Store not found',
      });
    }

    const savedRating =
      await Rating.findOneAndUpdate(
        {
          user: req.user._id,
          store: store._id,
        },
        {
          rating: Number(rating),
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        }
      );

    return res.json({
      rating: savedRating.rating,
      message:
        'Rating saved successfully',
    });
  } catch (err) {
    console.error(
      'Submit rating error:',
      err
    );

    return res.status(500).json({
      message: 'Failed to submit rating',
      error: err.message,
    });
  }
};
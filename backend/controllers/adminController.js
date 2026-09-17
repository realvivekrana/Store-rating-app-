const User = require('../models/User');
const Store = require('../models/Store');
const Rating = require('../models/Rating');

const {
  validateUserFields,
  validateEmail,
  validateName,
  validateAddress,
  escapeRegex,
} = require('../utils/validators');

// GET /api/admin/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const [
      totalUsers,
      totalStores,
      totalRatings,
    ] = await Promise.all([
      User.countDocuments(),
      Store.countDocuments(),
      Rating.countDocuments(),
    ]);

    return res.json({
      totalUsers,
      totalStores,
      totalRatings,
    });
  } catch (err) {
    console.error(
      'Admin dashboard error:',
      err
    );

    return res.status(500).json({
      message: 'Failed to load dashboard',
      error: err.message,
    });
  }
};

// POST /api/admin/users
exports.createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      address,
      role,
    } = req.body;

    const {
      valid,
      errors,
    } = validateUserFields({
      name,
      email,
      password,
      address,
    });

    if (!valid) {
      return res.status(400).json({
        errors,
      });
    }

    const allowedRoles = [
      'admin',
      'user',
      'owner',
    ];

    const finalRole =
      allowedRoles.includes(role)
        ? role
        : 'user';

    const normalizedEmail =
      email.trim().toLowerCase();

    const existing =
      await User.findOne({
        email: normalizedEmail,
      });

    if (existing) {
      return res.status(409).json({
        message:
          'Email is already registered',
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      address: address.trim(),
      role: finalRole,
    });

    return res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(
      'Create user error:',
      err
    );

    return res.status(500).json({
      message: 'Failed to create user',
      error: err.message,
    });
  }
};

// GET /api/admin/users
exports.listUsers = async (req, res) => {
  try {
    const {
      name,
      email,
      address,
      role,
      sortBy = 'createdAt',
      order = 'asc',
    } = req.query;

    const filter = {};

    if (name && name.trim()) {
      filter.name = {
        $regex: escapeRegex(name.trim()),
        $options: 'i',
      };
    }

    if (email && email.trim()) {
      filter.email = {
        $regex: escapeRegex(email.trim()),
        $options: 'i',
      };
    }

    if (address && address.trim()) {
      filter.address = {
        $regex: escapeRegex(address.trim()),
        $options: 'i',
      };
    }

    if (role) {
      filter.role = role;
    }

    const allowedSortFields = [
      'name',
      'email',
      'address',
      'role',
      'createdAt',
    ];

    const sortField =
      allowedSortFields.includes(sortBy)
        ? sortBy
        : 'createdAt';

    const sortDirection =
      order === 'desc' ? -1 : 1;

    const users = await User.find(
      filter
    ).sort({
      [sortField]: sortDirection,
    });

    const ownerIds = users
      .filter(
        (user) => user.role === 'owner'
      )
      .map((user) => user._id);

    const stores =
      ownerIds.length > 0
        ? await Store.find({
            owner: {
              $in: ownerIds,
            },
          })
        : [];

    const storeIdToOwner = {};

    stores.forEach((store) => {
      if (store.owner) {
        storeIdToOwner[
          store._id.toString()
        ] = store.owner.toString();
      }
    });

    const storeIds = stores.map(
      (store) => store._id
    );

    const ratingAggregation =
      storeIds.length > 0
        ? await Rating.aggregate([
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
          ])
        : [];

    const ownerAverageMap = {};

    ratingAggregation.forEach(
      (rating) => {
        const ownerId =
          storeIdToOwner[
            rating._id.toString()
          ];

        if (ownerId) {
          ownerAverageMap[ownerId] =
            Math.round(
              rating.average * 10
            ) / 10;
        }
      }
    );

    const result = users.map((user) => {
      const item = {
        id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
      };

      if (user.role === 'owner') {
        item.rating =
          ownerAverageMap[
            user._id.toString()
          ] ?? null;
      }

      return item;
    });

    return res.json({
      users: result,
    });
  } catch (err) {
    console.error(
      'List users error:',
      err
    );

    return res.status(500).json({
      message: 'Failed to list users',
      error: err.message,
    });
  }
};

// GET /api/admin/users/:id
exports.getUserDetail = async (
  req,
  res
) => {
  try {
    const user =
      await User.findById(
        req.params.id
      );

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    let rating = null;

    if (user.role === 'owner') {
      const store =
        await Store.findOne({
          owner: user._id,
        });

      if (store) {
        const aggregation =
          await Rating.aggregate([
            {
              $match: {
                store: store._id,
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

        if (aggregation.length > 0) {
          rating =
            Math.round(
              aggregation[0].average * 10
            ) / 10;
        }
      }
    }

    return res.json({
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
    console.error(
      'User detail error:',
      err
    );

    return res.status(500).json({
      message: 'Failed to load user',
      error: err.message,
    });
  }
};

// POST /api/admin/stores
exports.createStore = async (
  req,
  res
) => {
  try {
    const {
      name,
      email,
      address,
      ownerId,
    } = req.body;

    const errors = {};

    const nameError =
      validateName(name);

    if (nameError) {
      errors.name = nameError;
    }

    const emailError =
      validateEmail(email);

    if (emailError) {
      errors.email = emailError;
    }

    const addressError =
      validateAddress(address);

    if (addressError) {
      errors.address =
        addressError;
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        errors,
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const existing =
      await Store.findOne({
        email: normalizedEmail,
      });

    if (existing) {
      return res.status(409).json({
        message:
          'A store with this email already exists',
      });
    }

    let owner = null;

    if (ownerId) {
      const ownerUser =
        await User.findById(ownerId);

      if (
        !ownerUser ||
        ownerUser.role !== 'owner'
      ) {
        return res.status(400).json({
          message:
            'ownerId must reference a user with role "owner"',
        });
      }

      const alreadyAssigned =
        await Store.findOne({
          owner: ownerUser._id,
        });

      if (alreadyAssigned) {
        return res.status(409).json({
          message:
            'This owner is already assigned to a store',
        });
      }

      owner = ownerUser._id;
    }

    const store =
      await Store.create({
        name: name.trim(),
        email: normalizedEmail,
        address: address.trim(),
        owner,
      });

    return res.status(201).json({
      store,
    });
  } catch (err) {
    console.error(
      'Create store error:',
      err
    );

    return res.status(500).json({
      message: 'Failed to create store',
      error: err.message,
    });
  }
};

// GET /api/admin/stores
exports.listStores = async (
  req,
  res
) => {
  try {
    const {
      name,
      email,
      address,
      sortBy = 'createdAt',
      order = 'asc',
    } = req.query;

    const filter = {};

    if (name && name.trim()) {
      filter.name = {
        $regex: escapeRegex(name.trim()),
        $options: 'i',
      };
    }

    if (email && email.trim()) {
      filter.email = {
        $regex: escapeRegex(email.trim()),
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
      'email',
      'address',
      'createdAt',
    ];

    const sortField =
      allowedSortFields.includes(sortBy)
        ? sortBy
        : 'createdAt';

    const sortDirection =
      order === 'desc' ? -1 : 1;

    const stores =
      await Store.find(filter).sort({
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

    const aggregation =
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
            count: {
              $sum: 1,
            },
          },
        },
      ]);

    const ratingMap = {};

    aggregation.forEach((item) => {
      ratingMap[
        item._id.toString()
      ] = {
        average:
          Math.round(
            item.average * 10
          ) / 10,
        count: item.count,
      };
    });

    const result = stores.map(
      (store) => {
        const data =
          ratingMap[
            store._id.toString()
          ];

        return {
          id: store._id,
          name: store.name,
          email: store.email,
          address: store.address,
          rating:
            data?.average ?? null,
          ratingCount:
            data?.count ?? 0,
        };
      }
    );

    return res.json({
      stores: result,
    });
  } catch (err) {
    console.error(
      'List admin stores error:',
      err
    );

    return res.status(500).json({
      message: 'Failed to list stores',
      error: err.message,
    });
  }
};
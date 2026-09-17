const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validateUserFields } = require('../utils/validators');

function signToken(user) {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
}

function sanitizeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    address: user.address,
    role: user.role,
  };
}

// POST /api/auth/signup
exports.signup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      address,
    } = req.body;

    const { valid, errors } = validateUserFields({
      name,
      email,
      password,
      address,
    });

    if (!valid) {
      return res.status(400).json({ errors });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existing = await User.findOne({
      email: normalizedEmail,
    });

    if (existing) {
      return res.status(409).json({
        message: 'Email is already registered',
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      address: address.trim(),
      role: 'user',
    });

    const token = signToken(user);

    return res.status(201).json({
      token,
      user: sanitizeUser(user),
    });
  } catch (err) {
    console.error('Signup error:', err);

    return res.status(500).json({
      message: 'Signup failed',
      error: err.message,
    });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    const passwordMatch = await user.comparePassword(password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    const token = signToken(user);

    return res.json({
      token,
      user: sanitizeUser(user),
    });
  } catch (err) {
    console.error('Login error:', err);

    return res.status(500).json({
      message: 'Login failed',
      error: err.message,
    });
  }
};

// PUT /api/auth/update-password
exports.updatePassword = async (req, res) => {
  try {
    const {
      currentPassword,
      newPassword,
    } = req.body;

    if (!currentPassword) {
      return res.status(400).json({
        message: 'Current password is required',
      });
    }

    const { errors } = validateUserFields({
      password: newPassword,
    });

    if (errors.password) {
      return res.status(400).json({
        errors,
      });
    }

    const user = await User.findById(req.user._id).select(
      '+password'
    );

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    const passwordMatch =
      await user.comparePassword(currentPassword);

    if (!passwordMatch) {
      return res.status(401).json({
        message: 'Current password is incorrect',
      });
    }

    user.password = newPassword;

    await user.save();

    return res.json({
      message: 'Password updated successfully',
    });
  } catch (err) {
    console.error('Update password error:', err);

    return res.status(500).json({
      message: 'Failed to update password',
      error: err.message,
    });
  }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  return res.json({
    user: sanitizeUser(req.user),
  });
};
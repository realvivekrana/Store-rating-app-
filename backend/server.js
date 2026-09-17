require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const storeRoutes = require('./routes/storeRoutes');
const ownerRoutes = require('./routes/ownerRoutes');

const app = express();

app.disable('x-powered-by');

app.use(
  cors({
    origin: process.env.CLIENT_URL
      ? process.env.CLIENT_URL.split(',').map((v) => v.trim())
      : true,
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database:
      mongoose.connection.readyState === 1
        ? 'connected'
        : 'disconnected',
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/owner', ownerRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack || err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation failed',
      errors: Object.fromEntries(
        Object.entries(err.errors).map(([key, value]) => [
          key,
          value.message,
        ])
      ),
    });
  }

  // Invalid MongoDB ObjectId
  if (err.name === 'CastError') {
    return res.status(400).json({
      message: `Invalid ${err.path || 'resource'} id`,
    });
  }

  // Duplicate MongoDB key
  if (err.code === 11000) {
    const field =
      Object.keys(err.keyPattern || {})[0] || 'value';

    return res.status(409).json({
      message: `A record with this ${field} already exists`,
    });
  }

  res.status(err.statusCode || 500).json({
    message: err.statusCode
      ? err.message
      : 'Internal server error',
  });
});

const PORT = Number(process.env.PORT || 5000);

async function startServer() {
  if (!process.env.JWT_SECRET) {
    throw new Error(
      'JWT_SECRET is not configured. Create backend/.env and set a strong JWT_SECRET.'
    );
  }

  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

if (require.main === module) {
  startServer().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}

module.exports = {
  app,
  startServer,
};
// Run with: npm run seed:admin
// Creates the very first System Administrator account (from .env values)
// so someone can log in and start adding other users/stores.
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');

(async () => {
  await connectDB();

  const email = (process.env.ADMIN_EMAIL || 'admin@storerating.com').toLowerCase();
  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Admin user already exists:', email);
    process.exit(0);
  }

  const admin = await User.create({
    name: process.env.ADMIN_NAME || 'System Administrator Account',
    email,
    password: process.env.ADMIN_PASSWORD || 'Admin@12345',
    address: process.env.ADMIN_ADDRESS || 'Head Office, Admin Building, City Center',
    role: 'admin',
  });

  console.log('Admin user created:', admin.email);
  process.exit(0);
})();

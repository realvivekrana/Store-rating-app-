require('dotenv').config();

const mongoose = require('mongoose');
const User = require('../models/User');

async function fixAdminRole() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error(
        'MONGO_URI is missing in backend/.env'
      );
    }

    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      'MongoDB connected'
    );

    const email =
      process.argv[2] ||
      process.env.ADMIN_EMAIL;

    if (!email) {
      throw new Error(
        'Provide admin email as argument or set ADMIN_EMAIL in .env'
      );
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const user =
      await User.findOne({
        email: normalizedEmail,
      });

    if (!user) {
      throw new Error(
        `User not found: ${normalizedEmail}`
      );
    }

    user.role = 'admin';

    await user.save();

    console.log(
      `Admin role successfully assigned to ${user.email}`
    );

    process.exit(0);
  } catch (error) {
    console.error(
      'Failed to fix admin role:',
      error.message
    );

    process.exit(1);
  } finally {
    if (
      mongoose.connection.readyState !==
      0
    ) {
      await mongoose.connection.close();
    }
  }
}

fixAdminRole();
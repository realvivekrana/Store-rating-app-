// One-time fix: promotes the existing user with ADMIN_EMAIL to role "admin".
// This handles the case where that email was already used to sign up as a
// normal user (role defaults to 'user') BEFORE seed:admin ever ran, so
// seed:admin's "already exists" check silently skipped creating a real admin.
//
// Run with: node seed/fixAdminRole.js
require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');

(async () => {
  await connectDB();

  const email = (process.env.ADMIN_EMAIL || 'admin@storerating.com').toLowerCase();
  const user = await User.findOne({ email });

  if (!user) {
    console.log('No user found with email:', email, '- run "npm run seed:admin" instead.');
    process.exit(0);
  }

  if (user.role === 'admin') {
    console.log('User is already an admin:', email);
    process.exit(0);
  }

  user.role = 'admin';
  await user.save();
  console.log(`Promoted "${user.name}" (${email}) from role to admin. Password unchanged - log in with whatever password you used when you signed up.`);
  process.exit(0);
})();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 20,
      maxlength: 60,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // never return password by default
    },
    address: {
      type: String,
      required: true,
      maxlength: 400,
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'owner'],
      default: 'user',
      required: true,
    },
  },
  { timestamps: true }
);

// Note: no separate index() call for email — `unique: true` on the field above
// already creates that index; declaring it twice is what caused the Mongoose
// "Duplicate schema index" warning.
userSchema.index({ name: 1 });
userSchema.index({ role: 1 });

// Hash password before saving, only if it changed
userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
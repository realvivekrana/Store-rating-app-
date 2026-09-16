const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      maxlength: 400,
    },
    // A store can optionally be linked to a Store Owner user account.
    // The owner logs in with this user's credentials to see their dashboard.
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

// Note: no separate index() call for email — `unique: true` on the field above
// already creates that index.
storeSchema.index({ name: 1 });
storeSchema.index({ address: 1 });

module.exports = mongoose.model('Store', storeSchema);
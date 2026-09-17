const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Store name is required'],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: [true, 'Store email is required'],
      trim: true,
      lowercase: true,
      unique: true,
    },

    address: {
      type: String,
      required: [true, 'Store address is required'],
      trim: true,
      maxlength: 400,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

storeSchema.index({
  name: 1,
});

storeSchema.index({
  address: 1,
});

storeSchema.index({
  owner: 1,
});

module.exports = mongoose.model(
  'Store',
  storeSchema
);